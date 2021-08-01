import * as path from 'path';
import { CompanionFile } from './companion-file';
import {
  ActiveDocumentException,
  ErrorException,
  FindCompanionFileException,
  NoOpenWorkspaceException,
  PickCompanionFileException,
  SelectCompanionFileException
} from './exceptions';
import { FriendlyNameMap } from './friendly-name';
import { asyncCatch } from './tools';

export interface CompanionFilesFacade {
  getActiveDocumentPath(): string | undefined;
  findFilePaths(includePattern: string, excludePattern?: string): Promise<string[]>;
  getWorkspaceRootFoldersPaths(): string[];
  openCompanionFile(file: CompanionFile): Promise<any>;
  selectCompanionFile(files: CompanionFile[]): Promise<CompanionFile | undefined>;
  handleException(error: any | Error | ErrorException): any;
  getFriendlyNameMap(defaultFriendlyMap: FriendlyNameMap): FriendlyNameMap;
}

export const DEFAULT_FRIENDLY_NAME_MAP = {
  'component.ts': 'Component',
  'service.ts': 'Service',
  'pipe.ts': 'Pipe',
  'test.ts': 'Test',
  'directive.ts': 'Directive',
  'routes.ts': 'Routes',
  'guard.ts': 'Guard',
  'component.html': 'Component view',
  'component.scss': 'Component style',
  "component.spec": "Component specifications"
};

export class CompanionFiles {

  constructor(
    private readonly facade: CompanionFilesFacade
  ) { }

  /**
   * Entry point for this extension when is called
   */
  public async run() {
    const activeDocumentPath = this.facade.getActiveDocumentPath();
    if (activeDocumentPath === undefined) {
      throw new ActiveDocumentException();
    }

    const companionFiles = await this.getCompanionFiles(activeDocumentPath);
    if (companionFiles.length === 0) {
      throw new FindCompanionFileException();
    }

    const [selectedFile, error2] = await asyncCatch(this.facade.selectCompanionFile(companionFiles));
    if (!!error2) {
      throw new PickCompanionFileException();
    }
    if (selectedFile === undefined) {
      throw new SelectCompanionFileException();
    }

    this.facade.openCompanionFile(selectedFile);
  }

  public async getCompanionFiles(activeDocumentPath: string): Promise<CompanionFile[]> {
    const searchPatern = this.getSearchPattern(activeDocumentPath);
    const [candidatesFilesPaths, error] = await asyncCatch(this.facade.findFilePaths(searchPatern));
    if (!!error) {
      throw new FindCompanionFileException();
    }

    const companionFilesPaths = this.matchCompanion(activeDocumentPath, candidatesFilesPaths);
    const friendlyNameMap = await this.facade.getFriendlyNameMap(DEFAULT_FRIENDLY_NAME_MAP);
    const companionFiles = CompanionFile.createCompanionFiles(companionFilesPaths, friendlyNameMap);

    return companionFiles;
  }

  public getSearchPattern(activeDocumentPath: string) {
    const absoluteParentDirectoryPath = path.normalize(path.dirname(activeDocumentPath) + '/');
    const workspaceRootFoldersPaths = this.facade.getWorkspaceRootFoldersPaths();
    const rootPath = workspaceRootFoldersPaths.find(folderPath => absoluteParentDirectoryPath.indexOf(folderPath) >= 0) as string;
    if (rootPath === undefined) {
      throw new NoOpenWorkspaceException();
    }

    const relativeParentDirectoryPath = absoluteParentDirectoryPath.replace(rootPath, '');
    if (relativeParentDirectoryPath.length) {
      return path.normalize(relativeParentDirectoryPath + '/*');
    }

    return '*';
  }

  /**
   * 
   * @param activePath 
   * @param companionPaths 
   * @returns 
   */
  matchCompanion(activePath: string, companionPaths: string[]): string[] {
    const fileName = this.getConventionalFilePath(activePath);
    const filteredCompanionPaths = companionPaths.filter((companionPath: string) => {
      const companionName = this.getConventionalFilePath(companionPath);
      const isTheSameFileName = companionName === fileName;
      const isTheSameFilePath = activePath === companionPath;
      const isDifferentFile = isTheSameFileName && !isTheSameFilePath;

      return isDifferentFile;
    });

    return filteredCompanionPaths;
  }

  /**
 * @param filePath a file absolute or relative path
 * @returns the file path without its "suffixed pieces"
 * where "suffixed pieces" are every piece separated by "."
 * @example c:/some-folder/some-file.some-convetional-type-name.extension
 * returns c:/some-folder/some-file
 * @example  components/editor.component.ts
 * returns  components/editor
 */
  getConventionalFilePath(filePath: string): string {
    /**
     * NOTE: in order to support more
     * file name conventions, that may be passed 
     * as argument from config.
     */
    const splitter = '.';
    let split = path.basename(filePath).split(splitter);
    let name = split[0];
    return name;
  }
}
