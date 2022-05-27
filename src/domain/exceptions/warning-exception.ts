import { Exception } from "./exception";
import { ExceptionTypes } from "./exceptions-types";

export class WarningException extends Exception {
  public readonly type = ExceptionTypes.warn;
}