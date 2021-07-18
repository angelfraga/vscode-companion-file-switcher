import path = require('path');
import { FriendlyNameMap } from './friendly-name';

export interface CompanionFile {
  readonly filePath: string;
  readonly label: string;
  readonly description: string;
}

export function createCompanionFile(filePath: string, friendlyNameMap: FriendlyNameMap) {
  const extension = path.extname(filePath);
  const friendlyName = friendlyNameMap[extension];
  return {
    filePath,
    label: friendlyName ?? filePath,
    description: friendlyName ? filePath : ''
  };
}

export function createCompanionFiles(filePaths: string[], friendlyNameMap: FriendlyNameMap): CompanionFile[] {
  return filePaths.map(filePath => createCompanionFile(filePath, friendlyNameMap));
};
