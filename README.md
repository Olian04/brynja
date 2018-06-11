# What is and isn't paramus-render: 
* Paramus-render is a rendering engine designed to be used in conjunction with its sister library [Paramus](https://github.com/Olian04/Paramus).
* Paramus-render exposes a chaining based api that is ment to provide a stateless representation of the dom.
* Paramus-render aims to be an alternative to excessive use of "document.createElement"´. Especially when generating dynamic UIs for small to medium applications.
* Paramus-render is NOT designed to be used in large scale applications and will therefore not be designed nor optimized with large applications in mind.

# Installation
__NPM:__
```
npm i --save paramus-render
```

__CDN:__

```html
<script src="https://unpkg.com/paramus-render"></script>
```

# Setup - Hello World
_WIP: This is not yet implemented!_

You can setup paramus-render in one of two ways.

### Using the default "render" method
The default render method expects a dom element with id 'root' to exsist.
```ts
import { render } from 'paramus-render';

render(_=>_
  .child('p', _=>_
    .text('Hello World!')
  )
);
```

### Setting up your own Renderer instance
```ts
import { Renderer } from 'paramus-render';

const { render } = Renderer({
  rootElement: document.getElementById('root'),
  vdomRootType: 'div',
  allowRecursiveMutations: true
});

render(_=>_
  .child('p', _=>_
    .text('Hello World!')
  )
);
```

# Operations
In Paramus-render, method on the are exposed on the chaining api is refered to as _operations_ and are devided into 4 categories.
* Nesting operations
  * Nesting operations are used to append children to the current node.
* Mutating operations
  * Mutating operations are used to add and modify the data of the current node. 
  * For example assigning an ID or adding an event listener.
* Control flow operations
  * Control flow operations are used apply conditional rendering. 
  * For example only adding the "selected" class to an element if its index matches the selected element in the state.
* Effect free operations
  * When using Effect free operations you can be sure that no changes will be made in either the dom nor the vdom.
  * For example you can use effect free operations when debugging or logging.

```ts
// --- Nesting ops ---
.child(tagName, ctx)
.children(tagName, count, ctx) 
// --- Mutation ops ---
.id(value)
.class(valuesArr)
.name(value) 
.value(value)
.text(value)
.prop(key, value)
.on(eventName, callback)
.style(style_obj)
// --- Control flow ops ---
.when(predicat, then_ctx, else_ctx?)
.while(predicat, ctx) 
.do(ctx) 
// ---- Effect free ops ---
.peek(callback)
```

# Demos

```ts
import { Paramus } from 'paramus';
import { render } from 'paramus-render';

Paramus('url', {
  who: 'world'
}, state => render('root', _=>_
  .child('div', _=>_
    .id('foo')
    .class([ 'bar' ])
    .child('p', _=>_
      .prop('bar', 'biz')
      .value(`Hello ${state.who}!`)
      .on('click', () => {
        state.who = state.who.reverse();
      })
    )
  )
));

```

---

```ts
import { Paramus } from 'paramus';
import { render } from 'paramus-render';

Paramus('url', {
  arr: [1, 2, 3, 4]
}, state => render('root', _=>_
  .child('ul', _=>_
    .children('li', state.arr.length(), (_, i) =>_
      .value(`Value #${state.arr[i]}!`)
      .on('click', () => state.arr[i]++)
    )
  )
));

```
---

```ts
import { Paramus } from 'paramus';
import { render } from 'paramus-render';

Paramus('url', {
  tags: ['a', 'b', 'c'] 
}, state => render('root', _=>_
  .while(i => i < 4, (_, i) =>_
    .child(state.tags[i], _=>_
       .value(state.tags[i].toUpperCase())
    )
  )
));

```
---

```ts
import { Paramus } from 'paramus';
import { render } from 'paramus-render';

Paramus('url', {
  isTarget: true 
}, state => render('root', _=>_
  .style({
    border: { // Either way is ok
      style: 'solid',
      color: state.isTarget ? 'red' : 'black',
      width: '2px'
    },
    border: 'solid black 2px' // Either way is ok
  })
));

```
