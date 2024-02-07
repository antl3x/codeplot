/* -------------------------------------------------------------------------- */
/*                                   Exports                                  */
/* -------------------------------------------------------------------------- */

export { FileModel } from "./_impl_/FileModel";
export { FileManagerModel } from "./_impl_/FileManagerModel";

/* -------------------------------------------------------------------------- */
/*                                Code Exports                                */
/* -------------------------------------------------------------------------- */

import { FileManagerModel } from "./_impl_/FileManagerModel";

export const fileStore = FileManagerModel.create();
