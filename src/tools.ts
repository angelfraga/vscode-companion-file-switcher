import * as path from 'path';
import * as vscode from 'vscode';

export let getUriExtensions = function (uri: vscode.Uri): string {
    let split = path.basename(uri.fsPath).split('.');
    let exts = split.slice(1).join('.');
    return exts;
}

export let getUriName = function (uri: vscode.Uri): string {
    let split = path.basename(uri.fsPath).split('.');
    let name = split[0];
    return name;
}

export let getUriDirectory = function (uri: vscode.Uri): string {
    let dir = path.dirname(uri.fsPath);
    let root = vscode.workspace.rootPath;
    if (!root.endsWith('/')) {
        root = root + '/';
    }

    // Remove root directory
    dir = dir.replace(root, '');
    return dir;
}

export let getCompanionNameMap = function (): any {
    let d = {
        'component.ts': 'Component',
        'service.ts': 'Service',
        'pipe.ts': 'Pipe',
        'test.ts': 'Test',
        'directive.ts': 'Directive',
        'route.ts': 'Route',
        'component.html': 'Component view',
        'component.scss': 'Component style',
    };
    return vscode.workspace.getConfiguration().get('companionSwitcher.companionName', d);
}