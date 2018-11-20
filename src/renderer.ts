import { buildNode, BuilderCB, CustomOperation, CustomOperations } from './builder';
import { renderNode, updateNode } from './renderNode';
import { VNode } from './util/vnode';

export interface IRenderer {
    render(rootBuilder: BuilderCB): void;
    extend(operationName: string, constructor: CustomOperation): void;
}

export function Renderer(settings: {
    rootElement: HTMLElement;
    vdomRootType: string;
}): IRenderer {
    let rootElement: HTMLElement =  null;
    let oldRootNode: VNode = null;
    const customOperations: CustomOperations = {};
    return {
        render(rootBuilder: BuilderCB) {
            const rootNode = buildNode(settings.vdomRootType, rootBuilder, customOperations);
            if (rootElement === null) {
                rootElement = renderNode(rootNode);
                settings.rootElement.innerHTML = '';
                settings.rootElement.appendChild(rootElement);
            } else {
                updateNode(rootNode, oldRootNode, rootElement);
            }
            oldRootNode = rootNode;
        },
        extend(operationName: string, constructor: CustomOperation) {
            customOperations[operationName] = constructor;
        }
    }
}