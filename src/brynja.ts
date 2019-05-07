import { BuilderCB, CustomOperation } from "./builder";
import { Renderer, IRenderer } from './renderer';

export { Events } from './util/events';
export { Renderer } from './renderer';

const defaultRenderer: (() =>  IRenderer) = (() => {
    let default_renderer = null;
    return () => {
        if (default_renderer === null) {
            // This makes sure the dom is ready when the Renderer is constructed.
            default_renderer = Renderer({
                rootElement: document.getElementById('root')
            });
        }
        return default_renderer;
    }
})();
export const extend = (operationName: string, constructor: CustomOperation) =>
    defaultRenderer().extend(operationName, constructor);
export const render = (rootBuilder: BuilderCB) => 
    defaultRenderer().render(rootBuilder);