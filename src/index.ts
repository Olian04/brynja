import { buildNode, BuilderCB } from './builder';
import { renderNode } from './render';

export function render(rootNode: HTMLElement, rootBuilder: BuilderCB) {
  const vdom = buildNode(null, rootBuilder);
  const root = renderNode(vdom, rootNode);
}