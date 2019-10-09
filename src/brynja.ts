import { BuilderCB, CustomOperation } from './builder';
import { IRenderer, Renderer } from './renderer';

export { StyleObject } from './util/style-object';
export { Events } from './util/events';
export { Renderer } from './renderer';

const defaultRenderer: (() =>  IRenderer) = (() => {
    let default_renderer = null;
    return () => {
        if (default_renderer === null) {
            // This makes sure the dom is ready when the Renderer is constructed.
            default_renderer = Renderer({
                rootElement: document.getElementById('root'),
            });
        }
        return default_renderer;
    };
})();

// Because the tests run asynchronous its typically unreliable to test the extend functionality of the default renderer.
/* istanbul ignore next */
export const extend = (operationName: string, constructor: CustomOperation) =>
    defaultRenderer().extend(operationName, constructor);
export const render = (rootBuilder: BuilderCB) =>
    defaultRenderer().render(rootBuilder);
