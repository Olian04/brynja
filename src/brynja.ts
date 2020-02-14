import { BuilderCB } from './builder';
import { IRenderer } from './interfaces/Renderer';
import { Renderer } from './renderer';

export { Events } from './util/events';
export { Renderer } from './renderer';

const defaultRenderer: (() =>  IRenderer) = (() => {
    let default_renderer: IRenderer | null = null;
    return () => {
        if (default_renderer === null) {
            // This makes sure the dom is ready when the Renderer is constructed.
            const rootElement = document.getElementById('root');
            if (rootElement === null) {
                /* istanbul ignore next */
                throw new Error('Brynja: Unable to locate element with id "root"');
            }
            default_renderer = Renderer({
                rootElement,
            });
        }
        return default_renderer;
    };
})();

export const render = (rootBuilder: BuilderCB) =>
    defaultRenderer().render(rootBuilder);

/**
 * Usage of this function is 100% optional.
 * It serves ONLY to add type support for brynja operations through typescript and JSDocs.
 * @param {BuilderCB} cb
 */
export const builder = (cb: BuilderCB) => cb;
