import { CompanionFiles } from '../domain/companion-files';
import { VscodeCompanionFilesImpl } from '../infrastructure/adapters/vscode-companion-files';

export const switchCommand = async function () {
  const vscodeCompanionFilesImpl = new VscodeCompanionFilesImpl();
  const companionFiles = new CompanionFiles(vscodeCompanionFilesImpl);

  try {
    await companionFiles.run();
  } catch (error) {
    vscodeCompanionFilesImpl.handleException(error);
  }
};