import { FileData, TransformJs } from '../utils/compatibility-transform.js';

export interface CompatibilityTransformMiddleware {
  rootDir: string;
  fileExtensions: string[];
  transformJs: TransformJs;
}
