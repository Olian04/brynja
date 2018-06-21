import { buildNode, BuilderCB, CustomOperation, CustomOperations } from './builder';
import { renderNode } from './renderNode';

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