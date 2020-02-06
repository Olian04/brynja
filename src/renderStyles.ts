import { paramCase } from 'param-case';
import { StyleObject } from './util/style-object';

interface Styles { [key: string]: StyleObject; }
export function renderStyle(styles: Styles): string {

  const renderedStyles = Object.keys(styles).reduce((res, className) => {
    const allSelectors: Styles =
      Object.keys(styles[className]).reduce((res, key) => {
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

    const renderStyleObject = (className: string, styleObj: StyleObject): string => {
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
