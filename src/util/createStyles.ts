import { IStyleObject } from '../interfaces/StyleObject';

/**
 * Usage of this function is 100% optional.
 * It serves ONLY to add type support for brynja operations through typescript and JSDocs.
 * @param {IStyleObject} styles
 */
export const createStyles = <S extends IStyleObject>(styles: S) => styles;
