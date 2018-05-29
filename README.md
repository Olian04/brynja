# paramus-render


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
