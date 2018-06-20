import { buildNode, BuilderCB, CustomOperation, CustomOperations } from "./builder";
import { renderNode } from "./renderNode";

export { Events } from './util/events';

export interface IRenderer {
    render(rootBuilder: BuilderCB): void;
    extend(operationName: string, constructor: CustomOperation): void;
}

export function Renderer(settings: {
    rootElement: HTMLElement;
    vdomRootType: string;
}): IRenderer {
    const customOperations: CustomOperations = {};
    return {
        render(rootBuilder: BuilderCB) {
            const rootNode = buildNode(settings.vdomRootType, rootBuilder, customOperations);
            const rootElement = renderNode(rootNode);
            settings.rootElement.innerHTML = '';
            settings.rootElement.appendChild(rootElement);
        },
        extend(operationName: string, constructor: CustomOperation) {
            customOperations[operationName] = constructor;
        }
    }
}

const defaultRenderer: () =>  IRenderer = (() => {
    let default_renderer = null;
    return () => {
        if (default_renderer === null) {
            // This makes sure the dom is ready when the Renderer is constructed.
            default_renderer = Renderer({
                rootElement: document.getElementById('root'),
                vdomRootType: 'div'
            });
        }
        return default_renderer;
    }
})();
export const extend = (operationName: string, constructor: CustomOperation) =>
    defaultRenderer().extend(operationName, constructor);
export const render = (rootBuilder: BuilderCB) => 
    defaultRenderer().render(rootBuilder);