import * as path from 'path';
import { asyncCatch } from '../shared/utils/async-catch';
import { CompanionFilesAdapter } from './adapters/companion-files-adapter.service';
import { ErrorHandlerAdapter } from './adapters/error-handler-adapter.service';
import { Companion } from './entities/companion';
import { CompanionFile } from './entities/companion-file';
import { Config } from './entities/config';
import { File } from './entities/file';
import {
  ActiveDocumentException, FindCompanionFileException,
  NoOpenWorkspaceException, SelectCompanionFileException
} from './exceptions';


export const DEFAULT_CONFIG: Config = {
  exclude: [
    '**/node_modules/**'
  ],
  include: [
    {
      "type": "Angular",
      "companions": [
        {
          "label": "Component View",
          "matcher": "${name}.component.html",
          "globPattern": "${parentDirPath}${name}.component.html"
        },
        {
          "label": "Component",
          "matcher": "${name}.component.ts",
          "globPattern": "${parentDirPath}${name}.component.ts"
        },
        {
          "label": "Component Style",
          "matcher": "${name}.component.(css|scss)",
          "globPattern": "${parentDirPath}${name}.component.{css,scss}"
        },
        {
          "label": "Component Test",
          "matcher": "${name}.component.spec.ts",
          "globPattern": "${parentDirPath}${name}.component.spec.ts"
        },
        {
          "label": "Class",
          "matcher": "${name}.ts",
          "globPattern": "${parentDirPath}${name}.ts"
        },
        {
          "label": "Model",
          "matcher": "${name}.model.ts",
          "globPattern": "${parentDirPath}${name}.model.ts"
        },
        {
          "label": "Service",
          "matcher": "${name}.service.ts",
          "globPattern": "${parentDirPath}${name}.service.ts"
        },
        {
          "label": "Test",
          "matcher": "${name}.spec.ts",
          "globPattern": "${parentDirPath}${name}.spec.ts"
        },
      ]
    },
    {
      type: 'Java',
      companions: [
        {
          "label": "Class",
          "matcher": "${name}.java",
          "globPattern": "${rootPath}src/main/**${name}.java"
        },
        {
          "label": "Class Test",
          "matcher": "${name}.java",
          "globPattern": "${rootPath}src/test/**${name}.java"
        }
      ]
    },
    {
      type: 'Golang',
      companions: [
        {
          "label": "Go Class",
          "matcher": "${name}.go",
          "globPattern": "${parentDirPath}${name}.go"
        },
        {
          "label": "Go Test",
          "matcher": "${name}_test.go",
          "globPattern": "${parentDirPath}${name}_test.go"
        }
      ]
    }
  ]
};

export class CompanionFiles {

  constructor(
    private readonly adapter: CompanionFilesAdapter,
    private readonly errorHandler: ErrorHandlerAdapter
  ) { }

  /**
   * Entry point for this extension when is called
   */
  public async run() {
    try {
      const activeDocumentPath = this.adapter.getActiveDocumentPath();
      if (activeDocumentPath === undefined) {
        throw new ActiveDocumentException();
      }

      const companionFiles = await this.searchCompanionFiles(activeDocumentPath);
      if (companionFiles.length === 0) {
        throw new FindCompanionFileException();
      }


      const [, errorOnSelect] = await asyncCatch(
        this.adapter.selectCompanionFile(companionFiles)
      );
      if (errorOnSelect) {
        throw new SelectCompanionFileException();
      }
    } catch (error) {
      this.errorHandler.handleException(error);
    }
  }

  public async searchCompanionFiles(activeDocumentPath: string): Promise<CompanionFile[]> {
    const file = new File(activeDocumentPath);
    const rootFolderPaths = this.adapter.getWorkspaceRootFoldersPaths();
    const rootPath = file.findRootFolderPath(rootFolderPaths);
    if (rootPath === undefined) {
      throw new NoOpenWorkspaceException();
    }

    // this.facade.getConfig(DEFAULT_CONFIG);
    const config = DEFAULT_CONFIG;

    const matchedGroup = config.include.find(searchGroup => {
      const matchedCompanion = searchGroup.companions.find(companion => {
        const regex = new RegExp(companion.matcher.replace('${name}', '.*'));
        return regex.test(file.name);
      });
      return matchedCompanion;
    });

    if (!matchedGroup) {
      throw new FindCompanionFileException();
    }

    const names = matchedGroup.companions.map(companion => {
      // create three groups ()(.*)() where second is the name
      const remover = '(' + companion.matcher.replace('${name}', ')(.*)(') + ')';
      // first item is the string itself
      const [, , name] = file.name.match(new RegExp(remover)) || [];
      return name;
    });

    const name = names.reduce((a, b) => {
      if (!a) { return b; }
      if (!b) { return a; }
      if (a === b) { return a; }
      return a.length < b.length ? a : b;
    });

    const parentDirectoryRelativePath = file.parentDirPath().replace(rootPath, '');
    const workspaceFolderName = path.basename(rootPath);
    // The workspaceFolderPattern plus a space seems to work for filtering in a root folder
    const workspaceFolderPattern = workspaceFolderName + ' ';
    const patterns = matchedGroup.companions.map(companion => {

      const isFromRoot = /\$\{rootPath\}/.test(companion.globPattern);

      const patternWithVariables = companion.globPattern
        .replace('${name}', name)
        .replace('${parentDirPath}', parentDirectoryRelativePath)
        .replace('${rootPath}', '');

      return { ...companion, globPattern: patternWithVariables, isFromRoot };
    });
    const companionFiles = await this.getCompanionFiles(patterns, rootPath);

    return companionFiles;
  }

  async getCompanionFiles(companions: Companion[], rootPath: string): Promise<CompanionFile[]> {
    const companionFiles: CompanionFile[] = [];
    for (let companion of companions) {
      const [paths, error] = await asyncCatch(this.adapter.findFilePaths(companion.globPattern));
      if (!!error) {
        throw new FindCompanionFileException();
      }

      (paths || []).forEach(path => {
        if (path) {
          if (!companion.isFromRoot) {
            companionFiles.push(new CompanionFile(path, companion.label, path));
            return;
          }
          if (path.indexOf(rootPath) > -1) {
            companionFiles.push(new CompanionFile(path, companion.label, path));
          }
        }
      });
    }
    return companionFiles;
  }

}
