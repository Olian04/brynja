# What is and isn't Brynja: 

* brynja exposes a chaining based api that is ment to provide a stateless representation of the dom.
* brynja aims to be an alternative to excessive use of "document.createElement"´. Especially when generating dynamic UIs for small to medium applications.
* brynja is NOT designed to be used in large scale applications and will therefore not be designed nor optimized with large applications in mind.

# Why Brynja? 

* It's small but still extensive!
* It requires NO transpilation, everything runs as is in the browser.
* It's fully extendable!
* Everything is 100% typed and ready for Typescript!

# Installation

__NPM:__

[`npm i --save brynja`](https://www.npmjs.com/package/brynja)

__CDN:__

```html
<script src="https://unpkg.com/brynja/cdn/brynja.js"></script>
```

# Setup - Hello World

You can setup brynja in one of two ways.

## Using the default "render" method

The default render method expects a dom element with id 'root' to exsist.

```ts
import { render } from 'brynja';

render(_=>_
  .child('p', _=>_
    .text('Hello World!')
  )
);
```

## Setting up your own Renderer instance

```ts
import { Renderer } from 'brynja';

const { render } = Renderer({
  rootElement: document.getElementById('root'),
  vdomRootType: 'div'
});

render(_=>_
  .child('p', _=>_
    .text('Hello World!')
  )
);
```

# Operations

In brynja, method that are exposed on the chaining api is refered to as _operations_ and are devided into 4 categories; Nesting operations, Mutating operations, Control flow operations, and Effect free operations.

## Nesting operations

Nesting operations are used to append children to the current vdom node.

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

Mutating operations are used for adding and modifying data on the current vdom node. 

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

## Control flow operations

Control flow operations are used for conditional rendering. 

### .when(predicate, then_ctx, else_ctx?)

```ts
render(_=>_
  .when(() => true, _=>_
    .child('h1', _=>_)
  )
  .when(() => false, _=>_
    .child('h1', _=>_)
  ,_=>_
    .child('h2', _=>_)
  )
);
```

```html
<div><!--Root-->
  <h1><!-- First when: true --></h1>
  <h2><!-- Second when: false --></h2>
</div>
```

### .while(predicate, ctx) 

```ts
render(_=>_
  .while(i => i < 3, (_, i)=>_
    .child('div', _=>_
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

### .do(ctx, ....) 

```ts
const img = (width, height, src) => _=>_
  .child('img', _=>_
    .prop('width', width)
    .prop('height', heigh)
    .prop('src', src)
    .prop('alt', src.substring(src.lastIndexOf('/'), src.lastIndexOf('.')))
  );

render(_=>_
  .do(
    img(64, 64, '/assets/logo_small.png'),
    img(192, 192, '/assets/logo_medium.png')
  )
);
```

```html
<div><!--Root-->
  <img src="/assets/logo_small.png" height="64" width="64" alt="logo_small">
  <img src="/assets/logo_medium.png" height="192" width="192" alt="logo_medium">
</div>
```

## Effect free operations

When using Effect free operations you can be sure that no changes will be made in either the dom nor the vdom.

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

# Custom operations
On top of the pre defined operations you can also extend the renderer with your own custom operations. 

## Extend the default render method

```ts
import { render, extend } from 'brynja';

extend('img', (width, height, src) => _=>_
  .child('img', _=>_
    .prop('width', width)
    .prop('height', heigh)
    .prop('src', src)
    .prop('alt', src.substring(
       src.lastIndexOf('/')+1,
       src.lastIndexOf('.')
    ))
  )
)

render(_=>_
  .img(64, 64, '/assets/logo_small.png')
  .img(192, 192, '/assets/logo_medium.png')
)
```   

## Extend a custom renderer instance

```ts
import { Renderer } from 'brynja';

const { render, extend } = Renderer({
  rootElement: document.getElementById('root'),
  vdomRootType: 'div'
});

extend('img', (width, height, src) => _=>_
  .child('img', _=>_
    .prop('width', width)
    .prop('height', heigh)
    .prop('src', src)
    .prop('alt', src.substring(
       src.lastIndexOf('/')+1,
       src.lastIndexOf('.')
    ))
  )
)

render(_=>_
  .img(64, 64, '/assets/logo_small.png')
  .img(192, 192, '/assets/logo_medium.png')
)
```

# Demos

```ts
// Counter
import { Paramus } from 'paramus';
import { render } from 'brynja';

Paramus('url', {
  value: 0
}, state => render(_=>_
  .child('p', _=>_
    .text(state.value)
  )
  .child('button', _=>_
    .text('Increment')
    .on('click', () => state.value++)
  )
  .child('button', _=>_
    .text('Decrement')
    .on('click', () => state.value--)
  )
));
```

---

```ts
// Hello world!
import { Paramus } from 'paramus';
import { render } from 'brynja';

Paramus('url', {
  who: 'world'
}, state => render(_=>_
  .child('p', _=>_ 
    .text(`Hello ${state.who}!`)
  )
  .child('input', _=>_
    .prop('type', 'text')
    .prop('value', state.who)
    .on('change', e => state.who = e.target.value)
    .when(() => state.who !== null, _=>_
      .value(state.who)
    )
  )
));
```

---

```ts
// Tabulation
import { Paramus } from 'paramus';
import { render, extend } from 'brynja';

extend('table', (columns, data) => _=>_
  .child('table', _=>_
    .child('tr', _=>_
      .children('th', columns.length, (_, i)=>_
        .text(columns[i])
      )
    )
    .children('tr', data.length, (_, i)=>_
      .children('td', columns.length, (_, j)=>_
        .text(data[i][columns[j]])
      )
    )
  )
);

Paramus('url', {
  data: [
    { name: 'Bob', age: 20, weight: 75, height: 170 }
    { name: 'Lisa', age: 24, weight: 62, height: 168 }
    { name: 'Mattias', age: 33, weight: 94, height: 185 }
  ]
}, state => render(_=>_
  .table(['name', 'age'], state.data)
  .table(['weight', 'height'], state.data)
));
```

---

```ts
// Making a resquest
import { Paramus } from 'paramus';
import { render, extend } from 'brynja';

const input = (text, value, onChange) => _=>_
  .child('input', _=>_
    .prop('type', 'text')
    .prop('placeholder', text)
    .on('change', e => onChange(e.target.value))
    .when(() => value !== null, _=>_
      .value(value)
    )
  );

Paramus('url', {
  firstName: null,
  lastName: null,
  responseCode: null
}, state => render(_=>_
  .do(
    input('Firstname', 
      state.firstName, 
      firstName => state.firstName = firstName),
    input('Lastname', 
      state.lastName,
      lastName => state.lastName = lastName)
  )
  .child('button', _=>_
    .text('Submit')
    .on('click', () => 
      fetch(`/api/submit?firstname=${state.firstName}&lastname=${state.lastName}`)
        .then(res => state.responseCode = res.status)
    )
  )
));
```
