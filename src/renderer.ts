import { BuilderCB, buildNode, CustomOperation, CustomOperations, newVNode } from './builder';
import { renderNode } from './renderNode';
import { renderStyle } from './renderStyles';
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

            // Append styles if needed
            if (Object.keys(styles).length > 0) {
                rootNode.children.push(newVNode({
                    tag: 'style',
                    text: renderStyle(styles),
                    props: {
                        type: 'text/css',
                    },
                }));
            }

            // Render / Update HTML
            if (initialRender) {
                initialRender = false;
                const newRoot = renderNode(rootNode);
                config.rootElement.replaceWith(newRoot);
                config.rootElement = newRoot;
            } else {
                updateNode(rootNode, oldRootNode, config.rootElement);
            }

            // Update refs for next render
            oldRootNode = rootNode;
        },
        extend(operationName: string, constructor: CustomOperation) {
            customOperations[operationName] = constructor;
        },
    };
}
