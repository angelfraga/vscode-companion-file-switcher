import { Exception } from "./exception";
import { ExceptionTypes } from "./exceptions-types";

export class ErrorException extends Exception {
  public readonly type = ExceptionTypes.error;
}