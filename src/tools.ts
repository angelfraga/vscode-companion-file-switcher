import { basename, dirname } from 'path';
import * as vscode from 'vscode';

export const DEFAULT_CONFIG = {
  'component.ts': 'Component',
  'service.ts': 'Service',
  'pipe.ts': 'Pipe',
  'test.ts': 'Test',
  'directive.ts': 'Directive',
  'routes.ts': 'Routes',
  'guard.ts': 'Guard',
  'component.html': 'Component view',
  'component.scss': 'Component style',
  "component.spec": "Component specifications"
};

export function getUriExtensions(uri: vscode.Uri): string {
  const split = basename(uri.fsPath).split('.');
  const exts = split.slice(1).join('.');
  return exts;
}

export function getUriName(uri: vscode.Uri): string {
  const [name] = basename(uri.fsPath).split('.');
  return name;
}

export function getWorkspaceRelativeFilePath(fileUri: vscode.Uri): string {
  const fileAbsolutePath = dirname(fileUri.fsPath);
  let root = vscode.workspace.rootPath;
  if (!root.endsWith('/')) {
    root = root + '/';
  }

  const workspaceRelativeFilePath = fileAbsolutePath.replace(root, '');
  return workspaceRelativeFilePath;
}

export function getCompanionNameMap(): any {
  return vscode.workspace.getConfiguration().get(
    'companionFileSwitcher.friendlyName',
    DEFAULT_CONFIG
  );
}