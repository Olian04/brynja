# paramus-render


```ts
import { Paramus } from 'paramus';
import { render } from 'paramus-render';

Paramus('url', {
  who: 'world'
}, state => render('root', [
  'div#foo.bar', [
    'p[bar="biz"]', `Hello ${state}!`
  ]
]));

```
