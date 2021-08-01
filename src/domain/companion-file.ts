import path = require('path');
import { FriendlyNameMap } from './friendly-name';

export class CompanionFile {
  readonly filePath: string;
  readonly label: string;
  readonly description: string;

  constructor(
    filePath: string,
    label: string,
    description: string
  ) {
    this.filePath = filePath;
    this.label = label;
    this.description = description;
  }

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
