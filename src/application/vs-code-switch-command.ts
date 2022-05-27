import { CompanionFiles } from '../domain';
import { VscodeCompanionFilesAdapter, VSCodeErrorHandlerAdapter } from '../infrastructure';

export const vscodeSwitchCommand = async function () {
  const adapter = new VscodeCompanionFilesAdapter();
  const errorHandler = new VSCodeErrorHandlerAdapter();
  const companionFiles = new CompanionFiles(adapter, errorHandler);

  try {
    await companionFiles.run();
  } catch (error) {
    console.log('Companion Files Unexpected Error', { cause: error });
  }
};