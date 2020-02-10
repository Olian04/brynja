# Upgrading from major version 3 to major version 4

## Class Operation

In version 4.x the call signature of the class operation have been changed to better alight with other operations (ex: id & do).

```ts
// IN 3.x
render(_=>_
  .class([ 'foo', 'bar' ])
  .class([ 'biz' ])
);

// IN 4.x
render(_=>_
  .class('foo', 'bar')
  .class('biz')
);
```

## Custom Operations

In version 4.x custom operations have been dropped in favor of functional builders and the "do" syntax.

```ts
// IN 3.x
import { render, extend } from 'brynja';

extend('myOperation', (name: string = 'World') => _=>_
  .child('span', _=>_
    .text(`Hello ${name}!`)
  )
);

render(_=>_
  .myOperation()
  .myOperation('Brynja')
);

// IN 4.x
import { render, builder } from 'brynja';

const myOperation = (name: string = 'World') => builder(_=>_
  .child('span', _=>_
    .text(`Hello ${name}!`)
  )
);

render(_=>_
  .do(
    myOperation(),
    myOperation('Brynja'),
  )
);
```

## Peek Operation

In version 4.x the children property on the ctx copy returned from the peek operation has been limited to only the "length" and numbered properties.

```ts
// IN 3.x
render(_=>_
  .peek(ctx => {
    ctx.children.push({});
    // Will run, but won't change the underlying vdom.
  })
);

// IN 4.x
render(_=>_
  .peek(ctx => {
    ctx.children.push({});
    // Will throw. Error: Illegal Operation
  })
);
```
