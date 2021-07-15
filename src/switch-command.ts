import * as vscode from 'vscode';

import {CompanionFiles} from './companion-files';
import {createQuickPickItemList, QuickPickItem} from './quick-pick-item';

async function asyncCatch<T>(fn: Thenable<T> | Promise<T>): Promise<[T, any]> {
    try {
        const data = await fn;
        return [data, null];
    } catch (error) {
        return [null, error];
    }
}

export let switchCommand = async function () {

    let companionFile = new CompanionFiles();

    const [companionFilesURI, error] = await asyncCatch(companionFile.list());
    if(error){
        vscode.window.showErrorMessage('Failed to list companions document !');
        return;
    }
    // Create item list from companions files
    let qpItemList = createQuickPickItemList(companionFilesURI);
    if (qpItemList.length === 0) {
        vscode.window.showInformationMessage('No companions file found.');
        return;
    } 
    
    // Pick one
    const [pickedItem, error2] = await asyncCatch(vscode.window.showQuickPick(qpItemList));
    if(error2) {
        vscode.window.showErrorMessage('Failed to pick companion file.');
        return;
    }
    
    // Open doc
    const [document, error3] = await  asyncCatch(vscode.workspace.openTextDocument(pickedItem.uri));
    if (error3) {
        vscode.window.showErrorMessage('Failed to open companion file.');
        return;
    }

    // Show a text document to the active view column
    const active_view_column = vscode.window.activeTextEditor.viewColumn;
    const [,error4] = await asyncCatch(vscode.window.showTextDocument(document, active_view_column));
    if (error4) {
        vscode.window.showErrorMessage('Failed to show companion file.');
        return;
    } 
}