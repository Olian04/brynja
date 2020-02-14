import { paramCase } from 'param-case';
import { IStyleObject } from './interfaces/StyleObject';
import { IStyles } from './interfaces/Styles';

export function renderStyle(styles: IStyles): string {
  const renderedStyles = Object.keys(styles).reduce((res, className) => {
    const allSelectors: IStyles =
      Object.keys(styles[className]).reduce((res: IStyles, key) => {
        if (key.startsWith(':')) {
          // Extract pseudoClasses
          res[className + key] = styles[className][key];
        } else {
          // Pass the property along
          res[className] = {
            ...res[className],
            [key]: styles[className][key],
          };
        }
        return res;
      }, {});

    const renderStyleObject = (className: string, styleObj: IStyleObject): string => {
      const properties = Object.keys(styleObj)
        .map((k) => `${paramCase(k)}: ${styleObj[k]};`);

      return `.${className}{${properties.join('')}}`;
    };

    // Render all styles for the current className (including pseudo selectors)
    Object.keys(allSelectors).forEach((selector) => {
      res += renderStyleObject(selector, allSelectors[selector]);
    });
    return res;
  }, '');

  return renderedStyles;
}
