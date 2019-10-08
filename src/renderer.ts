import { BuilderCB, buildNode, CustomOperation, CustomOperations } from './builder';
import { renderNode } from './renderNode';
import { updateNode } from './updateNode';
import { VNode } from './util/vnode';

export interface IRenderer {
    render(rootBuilder: BuilderCB): void;
    extend(operationName: string, constructor: CustomOperation): void;
}

export function Renderer(config: {
    rootElement: HTMLElement;
}): IRenderer {
    let initialRender = true;
    let oldRootNode: VNode = null;
    const customOperations: CustomOperations = {};
    return {
        render(rootBuilder: BuilderCB) {
            const [rootNode, styles] = buildNode(
                config.rootElement.tagName.toLowerCase(),
                rootBuilder,
                customOperations,
            );
            if (initialRender) {
                initialRender = false;
                const newRoot = renderNode(rootNode);
                config.rootElement.replaceWith(newRoot);
                config.rootElement = newRoot;
            } else {
                updateNode(rootNode, oldRootNode, config.rootElement);
            }
            oldRootNode = rootNode;
        },
        extend(operationName: string, constructor: CustomOperation) {
            customOperations[operationName] = constructor;
        },
    };
}
