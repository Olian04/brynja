import { BuilderCB } from './builder';
import { defaultRendererFactory } from './defaultRenderer';

export { Events } from './util/events';
export { Renderer } from './renderer';
export { createComponent } from './util/createComponent';
export { createStyles } from './util/createStyles';

const defaultRenderer = defaultRendererFactory();

export const render = (rootBuilder: BuilderCB) =>
    defaultRenderer().render(rootBuilder);
