import { ExceptionTypes } from "./exceptions-types";

export abstract class Exception extends Error {
  abstract type: ExceptionTypes;
}