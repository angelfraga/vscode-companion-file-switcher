import * as vscode from 'vscode';
import { switchCommand } from './application/switch-command';


export function activate(context: vscode.ExtensionContext) {

  const disposable = vscode.commands.registerCommand('extension.companionFileSwitcher.switch', () => {
    switchCommand();
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {
}