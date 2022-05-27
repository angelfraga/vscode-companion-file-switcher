import { ErrorException } from "./error-exception";

export class ActiveDocumentException extends ErrorException {
  constructor() {
    super('No active document found.');
  }
}