import { VNode } from './interfaces/VNode';
import { renderNode } from './renderNode';

const TEXT_NODE = 3; // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType

export function updateNode(
  newNode: VNode,
  oldNode: VNode,
  elem: HTMLElement,
): void {
  if (newNode.tag.toLowerCase() !== oldNode.tag.toLowerCase()) {
    // Different tags requires a re-render
    const newElem = renderNode(newNode);
    elem.replaceWith(newElem);
  }

  // #region Update value
  if (newNode.value && newNode.value !== oldNode.value) {
    // @ts-ignore
    elem.value = newNode.value;
    elem.setAttribute('value', '' + newNode.value);
  } else if (newNode.value !== oldNode.value) {
    // @ts-ignore
    elem.value = undefined;
    elem.removeAttribute('value');
  }
  // #endregion

  // #region Update text node
  /* istanbul ignore else */ // there is no else statement, and istanbul doesn't like it
  if (oldNode.text === newNode.text) {
    // No change needed
  } else if (oldNode.text === '' && newNode.text !== '') {
    // Add text
    const $text = document.createTextNode(newNode.text);
    elem.appendChild($text);
  } else if (oldNode.text !== '') {
    /* istanbul ignore if */
    if (elem.firstChild === null || elem.firstChild.nodeType !== TEXT_NODE) {
      throw new Error(
        'Brynja: Unexpected "none text node" as first child of element: ' + elem,
      );
    }

    if (newNode.text === '') {
      // Remove text
      elem.firstChild.remove();
    } else if (newNode.text !== '') {
      // Update text
      elem.firstChild.textContent = newNode.text;
    }
  }
  // #endregion

  // #region Update props
  for (const prop in oldNode.props) {
    if (prop in newNode.events) { continue; }

    // @ts-ignore
    elem.removeAttribute(prop);
  }
  for (const prop in newNode.props) {
    // @ts-ignore
    elem.setAttribute(prop, newNode.props[prop]);
  }
  // #endregion

  // #region Update events
  for (const event in oldNode.events) {
    if (event in newNode.events) { continue; }

    // @ts-ignore
    elem[`on${event}`] = undefined;
  }
  for (const event in newNode.events) {
    // @ts-ignore
    elem[`on${event}`] = (e) => {
      newNode.events[event].forEach((cb) => {
        cb(e);
      });
    };
  }
  // #endregion

  // #region Update children
  for (let i = 0; i < newNode.children.length; i++) {
    if (i < oldNode.children.length) {
      // Updated elements compared to previous nodeTree
      updateNode(
        newNode.children[i],
        oldNode.children[i],
        elem.children.item(i) as HTMLElement,
      );
    } else {
      // Create new elements
      elem.appendChild(renderNode(newNode.children[i]));
    }
  }

  const firstInvalidIndex = newNode.children.length;
  const elementsToRemove = elem.children.length - firstInvalidIndex;
  for (let i = 0; i < elementsToRemove; i++) {
    // Remove extra elements
    const childElement = elem.children.item(firstInvalidIndex);
    /* istanbul ignore if */
    if (childElement === null) {
      throw new Error(
        `Brynja: Unexpected invalid child element while removing excess children from element: ${elem}`,
      );
    }
    childElement.remove();
  }
  // #endregion
}
