import { VNode } from "./util/vnode";

export function renderNode(node: VNode): HTMLElement {
    const elem = document.createElement(node.tag);
    if (node.value) {
        elem['value'] = node.value;
        elem.setAttribute('value', '' + node.value);
    }

    // This should be changed into appending a text node
    elem.innerText = node.text;
    
    Object.keys(node.props).forEach(prop => {
        elem.setAttribute(prop, node.props[prop]);
    });
    Object.keys(node.events).forEach(event => {
        elem.addEventListener(event, e => {
            node.events[event].forEach(cb => {
                cb(e);
            });
        });
    });
    node.children.forEach(node => {
        elem.appendChild(renderNode(node));
    });
    return elem;
}

export function updateNode(newNode: VNode, oldNode: VNode,  elem: HTMLElement): void {
    //console.log(oldNode.tag, newNode.tag);
    if (newNode.tag.toLowerCase() === oldNode.tag.toLowerCase()) {
        // Update
        if (newNode.value) {
            elem['value'] = newNode.value;
            elem.setAttribute('value', '' + newNode.value);
        } else {
            elem['value'] = undefined;
            elem.removeAttribute('value');
        }

        // This might be a problem.... might have to rethink the text operation
        // Yepp... this should be changed into appending a text node
        if (oldNode.text !== newNode.text && newNode.text !== '') {
            elem.innerText = newNode.text;
            // Assigning to the innerText value clears all children....
        }
        
        Object.keys(oldNode.props).forEach(prop => 
            elem.removeAttribute(prop)
        );
        Object.keys(newNode.props).forEach(prop =>
            elem.setAttribute(prop, newNode.props[prop])
        );
        
        Object.keys(oldNode.events).forEach(event =>
            oldNode.events[event].forEach(cb => {
                console.log(event, cb);
                elem.removeEventListener(event, cb)
            }
            )
        );
        Object.keys(newNode.events).forEach((event: string) => 
            newNode.events[event].forEach(cb =>
                elem.addEventListener(event, cb)
            )
        );

        for (let i = 0; i < elem.children.length; i++) {
            const child = <HTMLElement>elem.children.item(i);
            updateNode(newNode.children[i], oldNode.children[i], child)
        }
    } else {
        // Render nodeTree
        const newElem = renderNode(newNode);
        elem.parentNode.replaceChild(newElem, elem);
    }
}

type VNodeChange  = {
    kind: 'event' | 'text' | 'value' | 'child';
    operation: 'add' | 'update';
    value: string | number;
} | {
    kind: 'event' | 'text' | 'value' | 'child';
    operation: 'remove';
} | {
    kind: 'property';
    operation: 'add' | 'update';
    value: string;
    property: string;
} | {
    kind: 'property';
    operation: 'remove';
    property: string;
}
const constructChangeList = (newNode: VNode, oldNode: VNode): VNodeChange[] => {
    const changeList: VNodeChange[] = [];
    if (oldNode.value && newNode.value) {
        changeList.push({
            kind: 'value',
            operation: 'update',
            value: newNode.value
        });
    } else if (oldNode.value) {
        changeList.push({
            kind: 'value',
            operation: 'remove'
        });
    } else if (newNode.value) {
        changeList.push({
            kind: 'value',
            operation: 'add',
            value: newNode.value
        });
    }

    if (oldNode.text && newNode.text) {
        changeList.push({
            kind: 'text',
            operation: 'update',
            value: newNode.text
        });
    } else if (oldNode.text) {
        changeList.push({
            kind: 'text',
            operation: 'remove'
        });
    } else if (newNode.text) {
        changeList.push({
            kind: 'text',
            operation: 'add',
            value: newNode.text
        });
    }

    if ()
    return changeList;
} 

const removeEventListeners = (el: HTMLElement) => {
    // Src: https://stackoverflow.com/a/34693314/6224823
    const newEl = el.cloneNode(false);
    while (el.hasChildNodes()) newEl.appendChild(el.firstChild);
    el.parentNode.replaceChild(newEl, el);
}