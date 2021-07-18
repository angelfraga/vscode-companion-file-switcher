import * as path from 'path';

/**
 * @param filePath a file absolute or relative path
 * @returns the file path without its "suffixed pieces"
 * where "suffixed pieces" are every piece separated by "."
 * @example c:/some-folder/some-file.some-convetional-type-name.extension
 * returns c:/some-folder/some-file
 * @example  components/editor.component.ts
 * returns  components/editor
 */
export let getConventionalFilePath = function (filePath: string): string {
  /**
   * NOTE: in order to support more
   * file name conventions, that may be passed 
   * as argument from config.
   */
  const splitter = '.';
  let split = path.basename(filePath).split(splitter);
  let name = split[0];
  return name;
};

export async function asyncCatch<T>(fn: Thenable<T> | Promise<T>): Promise<[T, any]> {
  try {
    const data = await fn;
    return [data, null];
  } catch (error) {
    return [null as unknown as T, error];
  }
}

export function matchCompanion(sourcePath: string, companionPaths: string[]): string[] {
  const fileName = getConventionalFilePath(sourcePath);
  const filteredCompanionPaths = companionPaths.filter((companionPath: string) => {
    const companionName = getConventionalFilePath(companionPath);
    const isTheSameFileName = companionName === fileName;
    const isTheSameFilePath = sourcePath === companionPath;
    const isDifferentFile = isTheSameFileName && !isTheSameFilePath;

    return isDifferentFile;
  });

  return filteredCompanionPaths;
}