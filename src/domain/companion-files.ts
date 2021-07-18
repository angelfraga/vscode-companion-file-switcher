import * as path from 'path';
import {
  ActiveDocumentException,
  ErrorException,
  FindCompanionFileException,
  PickCompanionFileException,
  SelectCompanionFileException
} from './exceptions';
import { FriendlyNameMap } from './friendly-name';
import { CompanionFile, createCompanionFiles } from './quick-pick-item';
import { asyncCatch, matchCompanion } from './tools';

export interface CompanionFilesFacade {
  getActiveDocumentPath(): string | undefined;
  findFilesPaths(includePattern: string, excludePattern?: string): Promise<string[]>;
  getDirectoryPath(filePath: string): string;
  openCompanionFile(filePath: string): Promise<any>;
  selectCompanionFile(uris: CompanionFile[]): Promise<CompanionFile | undefined>;
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

  public async run() {
    const friendlyNameMap = await this.facade.getFriendlyNameMap(DEFAULT_FRIENDLY_NAME_MAP);
    const companionFilesPaths = await this.getCompanionFilesPaths();

    // Create item list from companions files
    let qpItemList = createCompanionFiles(companionFilesPaths, friendlyNameMap);
    if (qpItemList.length === 0) {
      throw new FindCompanionFileException();
    }

    // Pick one
    const [selected, error2] = await asyncCatch(this.facade.selectCompanionFile(qpItemList));
    if (!!error2) {
      throw new PickCompanionFileException();
    }
    if (selected === undefined) {
      throw new SelectCompanionFileException();
    }

    this.facade.openCompanionFile(selected.filePath);
  }

  public async getCompanionFilesPaths(): Promise<string[]> {
    const activeDocumentPath = this.facade.getActiveDocumentPath();
    if (activeDocumentPath === undefined) {
      throw new ActiveDocumentException();
    }
    const directoryPath = this.facade.getDirectoryPath(activeDocumentPath);
    let searchPatern = '*';
    if (directoryPath.length) {
      searchPatern = path.normalize(directoryPath + '/*');
    }
    const [companionFilesPaths, error] = await asyncCatch(this.facade.findFilesPaths(searchPatern));
    if (!!error) {
      throw new FindCompanionFileException();
    }
    return matchCompanion(activeDocumentPath, companionFilesPaths);
  }
}
