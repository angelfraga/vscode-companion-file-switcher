import path = require('path');
import * as vscode from 'vscode';
import { CompanionFile, CompanionFilesAdapter, Config } from '../domain';


export class VscodeCompanionFilesAdapter implements CompanionFilesAdapter {
  getConfig(defaultConfig: Config): Config {
    return vscode.workspace.getConfiguration().get('companion-files', defaultConfig);
  }

  getActiveDocumentPath() {
    return vscode.window.activeTextEditor?.document?.uri?.fsPath;
  }

  getWorkspaceRootFoldersPaths() {
    const nonOpenedWorkspaceFallback: vscode.WorkspaceFolder[] = [];
    const folders = vscode.workspace.workspaceFolders || nonOpenedWorkspaceFallback;
    const multiRootFoldersPaths = folders.map(folder => path.normalize(folder.uri.fsPath + '/'));
    return multiRootFoldersPaths;
  }

  async findFilePaths(searchPatern: string) {
    const documentUris = await vscode.workspace.findFiles(searchPatern, '**/node_modules/**');
    return documentUris.map(uri => uri.fsPath);
  }
  async selectCompanionFile(items: CompanionFile[]) {

    const selectedFile = await vscode.window.showQuickPick(items);
    if (selectedFile === undefined) {
      // eg esc key pressed
      return;
    }
    // Open doc
    const document = await vscode.workspace.openTextDocument(selectedFile.filePath);

    // Show a text document to the active view column
    const activeViewColumn = vscode.window.activeTextEditor?.viewColumn;
    await vscode.window.showTextDocument(document, activeViewColumn);
  }
};