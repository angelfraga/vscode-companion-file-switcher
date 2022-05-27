import * as vscode from 'vscode';
import { vscodeSwitchCommand } from './application';


export function activate(context: vscode.ExtensionContext) {

  const disposable = vscode.commands.registerCommand('extension.companion-files', () => {
    vscodeSwitchCommand();
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {
}