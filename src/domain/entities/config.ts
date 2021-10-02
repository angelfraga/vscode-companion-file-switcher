import { CompanionFileGroupConfig } from './companion-file-group-config';

export interface Config {
  exclude: string[];
  include: CompanionFileGroupConfig[]
}