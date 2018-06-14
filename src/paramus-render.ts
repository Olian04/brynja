import { buildNode, BuilderCB } from "./builder";
import { renderNode } from "./renderNode";

export { Events } from './builder';

export function Renderer(settings: {
    rootElement: HTMLElement;
    vdomRootType: string;
}) {
    return {
        render(rootBuilder: BuilderCB) {
            const rootNode = buildNode(settings.vdomRootType, rootBuilder);
            const rootElement = renderNode(rootNode);
            settings.rootElement.innerHTML = '';
            settings.rootElement.appendChild(rootElement);
        }
    }
}

export const render = (() => {
    let default_renderer = null;
    return (rootBuilder: BuilderCB) => {
        if (default_renderer === null) {
            default_renderer = Renderer({
                rootElement: document.getElementById('root'),
                vdomRootType: 'div'
            });
        }
        default_renderer.render(rootBuilder);
    }
})();