import { InfoException } from "./info-exception";

export class SelectCompanionFileException extends InfoException {
  constructor() {
    super('No companion file selected.');
  }
}
