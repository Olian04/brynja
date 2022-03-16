import { BuilderCB } from './builder';
import { IRenderer } from './interfaces/Renderer';
import { Renderer } from './renderer';

export { Events } from './util/events';
export { Renderer } from './renderer';
export { createComponent } from './util/createComponent';
export { createStyles } from './util/createStyles';

const defaultRenderer: (() =>  IRenderer) = (() => {
    let default_renderer: IRenderer | null = null;
    return () => {
        if (default_renderer === null) {
            // This makes sure the dom is ready when the Renderer is constructed.
            const rootElement = document.getElementById('root');
            /* istanbul ignore if */
            if (rootElement === null) {
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
