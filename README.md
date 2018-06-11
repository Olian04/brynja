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
  vdomRootType: 'div', // will be ignored if vdomRootIsFragment is true. 
  vdomRootIsFragment: false // Note: root level "mutating operations" will be turned off while true  
});

render(_=>_
  .child('p', _=>_
    .text('Hello World!')
  )
);
```

# Operations
In Paramus-render, method that are exposed on the chaining api is refered to as _operations_ and are devided into 4 categories; Nesting operations, Mutating operations, Control flow operations, and Effect free operations.

## Nesting operations
Nesting operations are used to append children to the current node.

### .child(tagName, ctx)
```ts
render(_=>_
  .child('div', _=>_
    .text('Hello World!')
  )
);
```
```html
<div><!--Root-->
  <div>
    Hello World!
  </div>
</div>
```

### .children(tagName, count, ctx) 
```ts
render(_=>_
  .children('div', 3, (_, i)=>_
    .text(i)
  )
);
```
```html
<div><!--Root-->
  <div>0</div>
  <div>1</div>
  <div>2</div>
</div>
```

## Mutating operations
Mutating operations are used to add and modify the current vdom node. 

### .id(value)
```ts
render(_=>_
  .child('div', _=>_
    .id('foo')
  )
);
```
```html
<div><!--Root-->
  <div id="foo"></div>
</div>
```

### .class(valuesArr)
```ts
render(_=>_
  .child('div', _=>_
    .class([ 'foo', 'bar' ])
    .class([ 'biz' ])
  )
);
```
```html
<div><!--Root-->
  <div class="foo bar biz"></div>
</div>
```

### .name(value) 
```ts
render(_=>_
  .child('div', _=>_
    .name('foo')
  )
);
```
```html
<div><!--Root-->
  <div name="foo"></div>
</div>
```

### .value(value)
```ts
render(_=>_
  .child('div', _=>_
    .value('foo')
  )
);
```
```html
<div><!--Root-->
  <div value="foo"></div>
</div>
```


### .text(value)
```ts
render(_=>_
  .child('div', _=>_
    .text('Foo')
  )
);
```
```html
<div><!--Root-->
  <div>Foo</div>
</div>
```

### .prop(key, value)
```ts
render(_=>_
  .child('div', _=>_
    .prop('foo', 'bar')
  )
);
```
```html
<div><!--Root-->
  <div foo="bar"></div>
</div>
```

### .on(eventName, callback)
```ts
render(_=>_
  .child('div', _=>_
    .on('click', e => console.log(e))
  )
);
```
```html
<div><!--Root-->
  <div><!-- The dom element has the onClick event registered --></div>
</div>
```

### .style(style_obj)
_WIP: Not yet implemented_
```ts
render(_=>_
  .child('div', _=>_
    .style({
      border: { // Either like this 
        color: 'black',
        style: 'solid',
        width: '2px'
      },
      border: 'black solid 2px' // Or like this
    })
  )
);
```
```html
<div><!--Root-->
  <div style="border: black solid 2px;"></div>
</div>
```

## Control flow operations
Control flow operations are used for conditional rendering. 

### .when(predicat, then_ctx, else_ctx?)
```ts
render(_=>_
  .child('div', _=>_
    .when(() => true, _=>_
      .class([ 'foo' ])
    )
  )
  .child('div', _=>_
    .when(() => false, _=>_
      .class([ 'foo' ])
    ,_=>_
      .class([ 'bar' ])
    )
  )
);
```
```html
<div><!--Root-->
  <div class="foo"></div>
  <div class="bar"></div>
</div>
```

### .while(predicat, ctx) 
```ts
render(_=>_
  .while(i => i < 3, _=>_
    .child('div', (_, i)=>_
      .text(i)
    )
  )
);
```
```html
<div><!--Root-->
  <div>0</div>
  <div>1</div>
  <div>2</div>
</div>
```

### .do(ctx) 
```ts
const input = text => _=>_
  .child('input', _=>_
    .prop('type', 'text')
    .name(text.toLowerCase())
    .prop('placeholder', text)
  );

render(_=>_
  .do(input('Firstname'))
  .do(input('Lastname'))
);
```
```html
<div><!--Root-->
  <input type="text" name="firstname" placeholder="Firstname">
  <input type="text" name="lastname" placeholder="Lastname">
</div>
```

## Effect free operations
When using Effect free operations you can be sure that no changes will be made in either the dom nor the vdom.
For example you can use effect free operations when debugging or logging.

### .peek(callback)
Peek at the current vdom node.
```ts
render(_=>_
  .peek(console.log)
);
```
```js
> { tag: 'div', value: null,  text: '', events: {}, props: {}, children: [] }
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
