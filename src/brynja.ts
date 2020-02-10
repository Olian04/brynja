import { BuilderCB } from './builder';
import { IRenderer } from './interfaces/Renderer';
import { Renderer } from './renderer';

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

export const render = (rootBuilder: BuilderCB) =>
    defaultRenderer().render(rootBuilder);

export const builder = (cb: BuilderCB) => cb;
