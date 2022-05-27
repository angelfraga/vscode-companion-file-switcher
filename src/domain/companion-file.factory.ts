import path = require('path');
import { CompanionFile } from './entities/companion-file';
import { FriendlyNameMap } from './entities/friendly-name';

export class CompanionFileFactory {

  static createCompanionFile(filePath: string, friendlyNameMap: FriendlyNameMap) {
    const fileName = path.basename(filePath);
    const extensionKey = Object.keys(friendlyNameMap).find(key => fileName.indexOf(key) >= 0);
    const friendlyName = extensionKey && friendlyNameMap[extensionKey];
    return {
      filePath,
      label: friendlyName ?? filePath,
      description: friendlyName ? filePath : '',
    };
  }

  static createCompanionFiles(filePaths: string[], friendlyNameMap: FriendlyNameMap): CompanionFile[] {
    return filePaths.map(filePath => this.createCompanionFile(filePath, friendlyNameMap));
  }
}
