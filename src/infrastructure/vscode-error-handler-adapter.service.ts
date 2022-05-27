import * as vscode from 'vscode';
import { ErrorHandlerAdapter, Exception, ExceptionTypes } from "../domain";

export class VSCodeErrorHandlerAdapter implements ErrorHandlerAdapter {
  async handleException(exception: Exception): Promise<void> {
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
}