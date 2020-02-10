import { BuilderCB, buildNode, newVNode } from './builder';
import { IRenderer } from './interfaces/Renderer';
import { VNode } from './interfaces/VNode';
import { renderNode } from './renderNode';
import { renderStyle } from './renderStyles';
import { updateNode } from './updateNode';

export function Renderer(config: {
    rootElement: HTMLElement;
}): IRenderer {
    let initialRender = true;
    let oldRootNode: VNode = null;
    return {
        render(rootBuilder: BuilderCB) {
            const [rootNode, styles] = buildNode(
                config.rootElement.tagName.toLowerCase(),
                rootBuilder,
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
    };
}
