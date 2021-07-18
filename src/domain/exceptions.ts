export enum ExceptionTypes {
  error = 'error',
  info = 'info',
  warn = 'warn'
}

export abstract class Exception extends Error {
  abstract type: ExceptionTypes;
}
export class ErrorException extends Exception {
  public readonly type = ExceptionTypes.error;
}
export class InfoException extends Exception {
  public readonly type = ExceptionTypes.info;
}
export class WarningException extends Exception {
  public readonly type = ExceptionTypes.warn;
}

export class OpenCompanionFileException extends ErrorException {
  constructor() {
    super('Failed to open companion file.');
  }
}
export class ShowCompanionFileException extends ErrorException {
  constructor() {
    super('Failed to show companion file.');
  }
}
export class FindCompanionFileException extends InfoException {
  constructor() {
    super('Failed to find companions files');
  }
}
export class ActiveDocumentException extends ErrorException {
  constructor() {
    super('No active document found');
  }
}
export class PickCompanionFileException extends ErrorException {
  constructor() {
    super('Failed to pick companion file.');
  }
}

export class SelectCompanionFileException extends ErrorException {
  constructor() {
    super('Failed to pick companion file.');
  }
}
