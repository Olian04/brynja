import { VNode } from "./util/vnode";

export function renderNode(nodeTree: VNode): HTMLElement {
    const elem = document.createElement(nodeTree.tag);
    if (nodeTree.value) {
        elem['value'] = nodeTree.value;
        elem.setAttribute('value', '' + nodeTree.value);
    }
    elem.innerText = nodeTree.text;
    Object.keys(nodeTree.props).forEach(prop => {
        elem.setAttribute(prop, nodeTree.props[prop]);
    });
    Object.keys(nodeTree.events).forEach(event => {
        elem.addEventListener(event, e => {
            nodeTree.events[event].forEach(cb => {
                cb(e);
            });
        });
    });
    nodeTree.children.forEach(node => {
        elem.appendChild(renderNode(node));
    });
    return elem;
}