import path = require('path');

import * as vscode from 'vscode';
import { CompanionFile } from '../../domain/companion-file';
import { CompanionFilesFacade } from "../../domain/companion-files";
import { Exception, ExceptionTypes, OpenCompanionFileException, ShowCompanionFileException } from "../../domain/exceptions";
import { FriendlyNameMap } from '../../domain/friendly-name';
import { asyncCatch } from "../../domain/tools";


export class VscodeCompanionFilesImpl implements CompanionFilesFacade {
  getFriendlyNameMap(defaultFriendlyMap: FriendlyNameMap): FriendlyNameMap {
    return vscode.workspace.getConfiguration().get('companionFileSwitcher.friendlyName', defaultFriendlyMap);
  }
  async selectCompanionFile(items: CompanionFile[]): Promise<CompanionFile | undefined> {
    const pickedItem = await vscode.window.showQuickPick(items);
    return pickedItem;
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
  async openCompanionFile(file: CompanionFile) {
    // Open doc
    const [document, error] = await asyncCatch(vscode.workspace.openTextDocument(file.filePath));
    if (error !== null) {
      throw new OpenCompanionFileException();
    }

    // Show a text document to the active view column
    const activeViewColumn = vscode.window.activeTextEditor?.viewColumn;
    const [, error2] = await asyncCatch(vscode.window.showTextDocument(document, activeViewColumn));
    if (error2 !== null) {
      throw new ShowCompanionFileException();
    }
  }

  handleException(exception: any | Error | Exception) {
    switch (exception?.type) {
      case ExceptionTypes.info:
        vscode.window.showInformationMessage(exception.message);
        break;
      case ExceptionTypes.warn:
        vscode.window.showWarningMessage(exception.message);
        break;
      case ExceptionTypes.error:
      default:
        vscode.window.showErrorMessage(exception.message);
        break;
    }
  }

};