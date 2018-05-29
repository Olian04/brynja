# paramus-render


```ts
import { Paramus } from 'paramus';
import { render } from 'paramus-render';

Paramus('url', {
  who: 'world'
}, state => render('root', ctx => ctx
  .child('div', ctx => ctx
    .id('foo')
    .class([ 'bar' ])
    .child('p', ctx => ctx
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
}, state => render('root', ctx => ctx
  .child('ul', ctx => ctx
    .children('li', state.arr.length(), (ctx, i) => ctx
      .value(`Value #${state.arr[i]}!`)
      .on('click', () => state.arr[i]++)
    )
  )
));

```
