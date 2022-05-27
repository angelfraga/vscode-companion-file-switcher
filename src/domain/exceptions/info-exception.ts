import { Exception } from "./exception";
import { ExceptionTypes } from "./exceptions-types";

export class InfoException extends Exception {
  public readonly type = ExceptionTypes.info;
}