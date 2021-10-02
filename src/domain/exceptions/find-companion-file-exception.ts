import { InfoException } from "./info-exception";

export class FindCompanionFileException extends InfoException {
  constructor() {
    super('No companions files found.');
  }
}