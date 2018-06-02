import { buildNode, BuilderCB } from './builder';
import { findDelta } from './delta';

export function render(rootNode: HTMLElement, rootBuilder: BuilderCB) {
  const vdom = buildNode(null, rootBuilder);
}