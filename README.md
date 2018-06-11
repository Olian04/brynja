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

render('root', _=>_
  .style({
    border: { // Either way is ok
      style: 'solid',
      color: 'black',
      width: '2px'
    },
    border: 'solid black 2px' // Either way is ok
  })
);

```

WIP: https://jsfiddle.net/6g41kqLc/10/


Context methods:

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
