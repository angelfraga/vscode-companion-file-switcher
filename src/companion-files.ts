import * as vscode from 'vscode';

import { getUriName, getWorkspaceRelativeFilePath } from './tools';


export class CompanionFiles {

  async list(): Promise<Array<vscode.Uri>> {

    if (!vscode.window.activeTextEditor) {
      throw "No active document found";
    }

    const doc = vscode.window.activeTextEditor.document;
    const searchPatern = getWorkspaceRelativeFilePath(doc.uri) + '/*';
    let files: vscode.Uri[];

    try {
      files = await vscode.workspace.findFiles(searchPatern, '**/node_modules/**')
    } catch (error) {
      throw "Failed to find companions files";
    }

    return this.matchCompanion(doc.uri, files);
  }

  matchCompanion(sourceUri: vscode.Uri, companionUris: Array<vscode.Uri>): Array<vscode.Uri> {
    let sourceName = getUriName(sourceUri);

    let filteredCompanionUris = companionUris.filter((companionUri: vscode.Uri) => {
      let companionName = getUriName(companionUri);
      const isSameFile = companionUri.fsPath === sourceUri.fsPath;
      const isCompanionName = companionName === sourceName;

      return isCompanionName && !isSameFile;
    });

    return filteredCompanionUris;
  }

}
