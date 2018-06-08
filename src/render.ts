import { NodeDTO } from "./node";
import { create } from "domain";

export function renderNode(nodeTree: NodeDTO): HTMLElement {
    const elem = document.createElement(nodeTree.tag);
    if (nodeTree.value) {
        elem['value'] = nodeTree.value;
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