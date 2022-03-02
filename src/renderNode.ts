import { VNode } from './interfaces/VNode';

export function renderNode(node: VNode): HTMLElement {
  const elem = document.createElement(node.tag);
  if (node.value) {
    // @ts-ignore
    elem.value = node.value;
    elem.setAttribute('value', '' + node.value);
  }

  if (node.text !== '') {
    const $text = document.createTextNode(node.text);
    elem.appendChild($text);
  }

  Object.keys(node.props).forEach((prop) => {
    elem.setAttribute(prop, node.props[prop]);
  });
  Object.keys(node.events).forEach((event) => {
    elem.addEventListener(event, (e) => {
      node.events[event].forEach((cb) => {
        cb(e);
      });
    });
  });
  node.children.forEach((node) => {
    elem.appendChild(renderNode(node));
  });
  return elem;
}
