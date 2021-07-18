import path = require('path');
import { FriendlyNameMap } from './friendly-name';

export interface CompanionFile {
  readonly filePath: string;
  readonly label: string;
  readonly description: string;
}

export function createCompanionFile(filePath: string, friendlyNameMap: FriendlyNameMap) {
  const fileName = path.basename(filePath);
  const extensionKey = Object.keys(friendlyNameMap).find(key => fileName.indexOf(key) >= 0);
  const friendlyName = extensionKey && friendlyNameMap[extensionKey];
  return {
    filePath,
    label: friendlyName ?? filePath,
    description: friendlyName ? filePath : ''
  };
}

export function createCompanionFiles(filePaths: string[], friendlyNameMap: FriendlyNameMap): CompanionFile[] {
  return filePaths.map(filePath => createCompanionFile(filePath, friendlyNameMap));
};
