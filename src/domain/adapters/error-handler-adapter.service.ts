import { Exception } from "../exceptions";

export interface ErrorHandlerAdapter {
  handleException(exception: Exception): Promise<void>;
}