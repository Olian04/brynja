[![CircleCI](https://img.shields.io/circleci/project/github/Olian04/brynja.svg?label=tests&logo=circleci)](https://circleci.com/gh/Olian04/brynja)
[![Test coverage](https://img.shields.io/codecov/c/gh/Olian04/brynja.svg?logo=codecov)](https://codecov.io/gh/Olian04/brynja)
[![Maintainability](https://api.codeclimate.com/v1/badges/0f31d9a1d3596ee82859/maintainability)](https://codeclimate.com/github/Olian04/brynja/maintainability)
[![Known Vulnerabilities](https://snyk.io/test/github/Olian04/brynja/badge.svg?targetFile=package.json)](https://snyk.io/test/github/Olian04/brynja?targetFile=package.json)

[![NPM Version](https://img.shields.io/npm/v/brynja.svg?logo=npm)](https://www.npmjs.com/package/brynja)
[![License](https://img.shields.io/npm/l/brynja.svg)](LICENSE)
![Available types](https://img.shields.io/npm/types/brynja.svg)
[![Size](https://img.shields.io/bundlephobia/min/brynja.svg)](https://bundlephobia.com/result?p=brynja)

 [![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/olian04/brynja/issues)
 [![# of contributors](https://img.shields.io/github/contributors/olian04/brynja.svg)](https://github.com/Olian04/brynja/graphs/contributors)

![Logo](https://raw.githubusercontent.com/Olian04/brynja/master/assets/brynja_logo.png)

> Brynja is a virtual DOM implementation with a declarative chaining based javascript API.

# Why Brynja

* It's small.
* It requires NO transpilation, everything runs as is in the browser.
* Everything is 100% typed and ready for Typescript!

# Installation

__NPM:__

[`npm install brynja`](https://www.npmjs.com/package/brynja)

__CDN:__

```html
<script src="https://cdn.jsdelivr.net/npm/brynja/cdn/brynja.js"></script>
```

# Upgrading from 3.x to 4.x

_See [upgrading guide](./guides/upgrading-from-3.x-to-4.x.md)_

# Help me help you

<a href="https://www.buymeacoffee.com/olian04" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: auto !important;width: auto !important;" ></a>

# Demos

* Hello World: <https://jsfiddle.net/olian04/kcfserx5/>
* Table generation: <https://jsfiddle.net/olian04/4feazykx/>
* Updates: <https://jsfiddle.net/olian04/6tnLbvaz/>
* User input: <https://jsfiddle.net/olian04/jwqa6Le1/40/>
* Probabilistic Propagation: <https://jsfiddle.net/olian04/bL0hjrd5/>
* Interpolation animation:
  1. <https://jsfiddle.net/olian04/7ub58xj4/>
  2. <https://jsfiddle.net/olian04/9cnjofv1/>
  3. <https://jsfiddle.net/olian04/9cnjofv1/16/>
* With [html-router](https://github.com/Olian04/html-router): <https://jsfiddle.net/olian04/mu5sz029/>

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
  rootElement: document.getElementById('root')
});

render(_=>_
  .child('p', _=>_
    .text('Hello World!')
  )
);
```

# Operations

In brynja, method that are exposed on the chaining api is referred to as _operations_ and are divided into 4 categories; Nesting operations, Mutating operations, Control flow operations, and Effect free operations.

- [Nesting operations](#nesting-operations)
  - [.child(tagName, ctx)](#childtagname-ctx)
  - [.children(tagName, count, ctx)](#childrentagname-count-ctx)
- [Mutating operations](#mutating-operations)
  - [.id(value)](#idvalue)
  - [.class(valuesArr)](#classvaluesarr)
  - [.name(value)](#namevalue)
  - [.value(value)](#valuevalue)
  - [.text(value)](#textvalue)
  - [.prop(key, value)](#propkey-value)
  - [.on(eventName, callback)](#oneventname-callback)
  - [.style(styleObject)](#stylestyleobject)
- [Control flow operations](#control-flow-operations)
  - [.when(booleanExpression, then_ctx, else_ctx?)](#whenbooleanexpression-thenctx-elsectx)
  - [.while(predicate, ctx)](#whilepredicate-ctx)
  - [.do(...ctx[])](#doctx)
- [Effect free operations](#effect-free-operations)
  - [.peek(callback)](#peekcallback)

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

### .style(styleObject)

```ts
render(_=>_
  .child('div', _=>_
    .text('Hello')
    .style({
      background: 'blue',
      ':hover': {
        background: 'red'
      }
    })
  )
);
```

```html
<div><!--Root-->
  <div class="brynja-d047bd7b6186cdc860a6348471743d9f76adfafa">Hello</div>
  <style>
    .brynja-d047bd7b6186cdc860a6348471743d9f76adfafa {
      background:  blue;
    }
    .brynja-d047bd7b6186cdc860a6348471743d9f76adfafa:hover {
      background:  red;
    }
  </style>
</div>
```

## Control flow operations

Control flow operations are used for conditional rendering.

### .when(booleanExpression, then_ctx, else_ctx?)

```ts
render(_=>_
  .when(true, _=>_
    .child('h1', _=>_)
  )
  .when(false, _=>_
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

### .do(...ctx[])

```ts
import { builder } from 'brynja';

const img = (width, height, src) => builder(_=>_
  .child('img', _=>_
    .prop('width', width)
    .prop('height', heigh)
    .prop('src', src)
    .prop('alt', src.substring(src.lastIndexOf('/'), src.lastIndexOf('.')))
  )
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

# Legal

Licensed under MIT. See [LICENSE](LICENSE).

<div>Logo made by <a href="https://www.freepik.com/?__hstc=57440181.05b687f541f472b41b82875365d361dd.1557313741285.1557313741285.1557313741285.1&__hssc=57440181.3.1557313741288&__hsfp=1938472413" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/"        title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/"        title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
