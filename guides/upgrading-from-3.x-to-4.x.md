# Upgrading from major version 3 to major version 4

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
