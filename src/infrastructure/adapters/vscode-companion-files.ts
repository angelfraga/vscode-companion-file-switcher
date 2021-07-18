import path = require('path');
import * as vscode from 'vscode';
import { CompanionFilesFacade } from "../../domain/companion-files";
import { Exception, ExceptionTypes, OpenCompanionFileException, ShowCompanionFileException } from "../../domain/exceptions";
import { FriendlyNameMap } from '../../domain/friendly-name';
import { CompanionFile } from '../../domain/quick-pick-item';
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

  getDirectoryPath(documentPath: string) {
    const absoluteDirectoryPath = path.normalize(path.dirname(documentPath) + '/');
    // TODO: use vscode.workspace.workspaceFolders instead
    const root = path.normalize(vscode.workspace.rootPath + '/');

    // Remove root directory
    const relativeDirectoryPath = absoluteDirectoryPath.replace(root, '');
    return relativeDirectoryPath;
  }
  async findFilesPaths(searchPatern: string) {
    const documentUris = await vscode.workspace.findFiles(searchPatern, '**/node_modules/**');
    return documentUris.map(uri => uri.fsPath);
  }
  async openCompanionFile(filePath: string) {
    // Open doc
    const [document, error] = await asyncCatch(vscode.workspace.openTextDocument(filePath));
    if (error !== null) {
      throw new OpenCompanionFileException();
    }

    // Show a text document to the active view column
    const activeViewColumn = vscode.window.activeTextEditor?.viewColumn;
    const [, error2] = await asyncCatch(vscode.window.showTextDocument(document, activeViewColumn));
    if (error !== null) {
      throw new ShowCompanionFileException();
    }
  }

  handleException(exception: any | Error | Exception) {
    switch (exception.type) {
      case ExceptionTypes.error:
        vscode.window.showErrorMessage(exception.message);
        break;
      case ExceptionTypes.info:
        vscode.window.showInformationMessage(exception.message);
        break;
      case ExceptionTypes.warn:
        vscode.window.showWarningMessage(exception.message);
        break;
      default:
        vscode.window.showErrorMessage(exception.message);
        break;
    }
  }
};