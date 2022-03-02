import { BuilderCB } from '../builder';

/**
 * Usage of this function is 100% optional.
 * It serves ONLY to add type support for brynja operations through typescript and JSDocs.
 * @param {(...args: any[]) => BuilderCB} componentConstructor
 */
export const createComponent = <F extends (...args: any[]) => BuilderCB>(
  componentConstructor: F,
) => componentConstructor;
