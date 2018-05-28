# paramus-render


```ts
import { Paramus } from 'paramus';
import { render } from 'paramus-render';

Paramus('url', {
  who: 'world'
}, state => render('root')
  .child('div', self => self
    .id('foo')
    .class([ 'bar' ])
    .child('p', self => self
      .prop('bar', 'biz')
      .value(`Hello ${state.who}!`)
      .on('click', () => {
        state.who = state.who.reverse();
      })
    )
  )
);

```

---

```ts
import { Paramus } from 'paramus';
import { render } from 'paramus-render';

Paramus('url', {
  arr: [1, 2, 3, 4]
}, state => render('root')
  .child('ul', self => self
    .children('li', (self, i) => self
      .value(`Value #${state.arr[i]}!`)
      .on('click', () => state.arr[i]++)
    )
  )
);

```
