import { VNode } from "./util/vnode";
import { renderNode } from './renderNode';

const TEXT_NODE = 3; // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType

export function updateNode(newNode: VNode, oldNode: VNode,  elem: HTMLElement): void {
  if (newNode.tag.toLowerCase() !== oldNode.tag.toLowerCase()) {
    // Different tags requires a re-render
    const newElem = renderNode(newNode);
    elem.parentNode.replaceChild(newElem, elem);
  }

  // #region Update value
  if (newNode.value && newNode.value !== oldNode.value) {
      elem['value'] = newNode.value;
      elem.setAttribute('value', '' + newNode.value);
  } else if (newNode.value !== oldNode.value) {
      elem['value'] = undefined;
      elem.removeAttribute('value');
  }
  // #endregion

  // #region Update text node
  if (oldNode.text === newNode.text) {
    // No change needed
  } else if (oldNode.text === '' && newNode.text !== '') {
    // Add text
    const $text = document.createTextNode(newNode.text);
    elem.appendChild($text);
  } else if (oldNode.text !== '') {
    if (elem.firstChild.nodeType !== TEXT_NODE) {
      throw new Error('Unexpected "none text node" as first child of element: ' + elem);
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
  [ // TODO: Remove duplicate props
    ...Object.keys(oldNode.props),
    ...Object.keys(newNode.props)
  ].forEach(prop => {
    if (prop in oldNode.props && !(prop in newNode.props)) {
      // Remove prop
      elem.removeAttribute(prop);
    } else if (prop in newNode.props && !(prop in oldNode.props)) {
      // Add prop
      elem.setAttribute(prop, newNode.props[prop]);
    } else if (prop in newNode.props && prop in oldNode.props && newNode.props[prop] !== oldNode.props[prop]) {
      // Update prop
      elem.setAttribute(prop, newNode.props[prop]);
    }
  });
  // #endregion
  
  // #region Update events
  [ // TODO: Remove duplicate events
    ...Object.keys(oldNode.events),
    ...Object.keys(newNode.events)
  ].forEach(event => {
    if (event in oldNode.events && !(event in newNode.events)) {
      // Remove all listeners
      oldNode.events[event].forEach(cb => {
          elem.removeEventListener(event, cb)
      });
    } else if (event in newNode.events && !(event in oldNode.events)) {
      // Add new listeners
      newNode.events[event].forEach(cb => {
        elem.addEventListener(event, cb)
      });
    } else if (event in newNode.events && event in oldNode.events) {
      // Some listeners might have changed

      // TODO: Compare function signatures between oldNode and newNode to limit nr of assignments each render
      oldNode.events[event].forEach(cb => {
        elem.removeEventListener(event, cb)
      });
      newNode.events[event].forEach(cb => {
        elem.addEventListener(event, cb)
      });
    }
  });
  // #endregion

  // #region Update children
  for (let i = 0; i < newNode.children.length; i++) {
    if (i < oldNode.children.length) {
      // Updated elements compared to previous nodeTree
      updateNode(newNode.children[i], oldNode.children[i], <HTMLElement>elem.children.item(i));
      console.log('updated:', elem.children.item(i).textContent);
    } else {
      // Create new elements
      elem.appendChild(renderNode(newNode.children[i]));
      console.log('added:', elem.children.item(i).textContent);
    }
  }

  const firstInvalidIndex = newNode.children.length;
  const elementsToRemove = elem.children.length - firstInvalidIndex;
  for (let i = 0; i < elementsToRemove; i++) {
    // Remove extra elements
    
    console.log('removed:', elem.children.item(firstInvalidIndex).textContent);
    elem.children.item(firstInvalidIndex).remove();
  }

  // #endregion
}