import { ErrorException } from "./error-exception";

export class NoOpenWorkspaceException extends ErrorException {
  constructor() {
    super('No workspace opened.');
  }
}
