import * as vscode from 'vscode';

import { CompanionFiles } from './companion-files';
import { createQuickPickItemList, QuickPickItem } from './quick-pick-item';

// NOTE: clear if pass vscode stuff such current document... as args
// in order to remove side effects ?
export async function switchCommand() {

  const companionFile = new CompanionFiles();

  let uris;

  try {
    uris = await companionFile.list();
  } catch {
    vscode.window.showErrorMessage('Failed to list companions document!');
    return;
  }

  // Create item list from companions files
  const quickPickItemList = createQuickPickItemList(uris);
  const isQuickPickItemListEmpty = quickPickItemList.length === 0;
  if (isQuickPickItemListEmpty) {
    vscode.window.showInformationMessage('No companions file found.');
    return;
  }

  let pickedItem: QuickPickItem;
  try {
    // Pick one
    pickedItem = await vscode.window.showQuickPick(quickPickItemList);
  } catch (error) {
    vscode.window.showErrorMessage('Failed to pick companion file.');
    return;
  }

  let document: vscode.TextDocument;
  try {
    // Open doc
    document = await vscode.workspace.openTextDocument(pickedItem.uri);
  } catch (error) {
    vscode.window.showErrorMessage('Failed to open companion file.');
    return;
  }

  const activeViewColumn = vscode.window.activeTextEditor.viewColumn;
  try {
    // Show a text document to the active view column
    await vscode.window.showTextDocument(document, activeViewColumn)
  } catch (error) {
    vscode.window.showErrorMessage('Failed to show companion file.');
  }
}