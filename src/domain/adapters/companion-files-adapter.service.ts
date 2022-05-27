import { CompanionFile } from "../entities/companion-file";
import { Config } from "../entities/config";

export interface CompanionFilesAdapter {
  getActiveDocumentPath(): string | undefined;
  findFilePaths(includePattern: string, excludePattern?: string): Promise<string[]>;
  getWorkspaceRootFoldersPaths(): string[];
  selectCompanionFile(files: CompanionFile[]): Promise<any>;
  getConfig(defaultConfig: Config): Config;
}