import * as path from 'path';

export class File {
  readonly path: string;

  get name(): string {
    return path.basename(this.path);
  }
  constructor(path: string) {
    this.path = path;
  }

  parentDirPath(): string {
    return path.normalize(path.dirname(this.path) + '/');
  }

  findRootFolderPath(foldersPaths: string[]) {
    const parentDirPath = this.parentDirPath();
    return foldersPaths.find(folderPath => parentDirPath.indexOf(folderPath) >= 0) as string;
  }


  toString(): string {
    return this.path;
  }
}