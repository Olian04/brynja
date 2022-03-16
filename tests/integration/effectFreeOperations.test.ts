import { expect } from 'chai';
import { describe } from 'mocha';

// tslint:disable-next-line:no-var-requires
const jsdom: () => void = require('mocha-jsdom');

import { render } from '../../src/brynja';

describe('Integrations test', () => {
    jsdom();

    beforeEach(() => {
        document.body.innerHTML = '<div id="root"></div>';
    });

    describe('Effect free operations', ()  => {
        it('peek should return correct vdom data for root builder', () => {
            render((_) => _
                .peek((ctx) => {
                    const expected = { tag: 'div', value: null,  text: '', events: {}, props: {}, children: [] };
                    expect(ctx).to.deep.equal(expected);
                })
            );
        });
        it('peek should return correct vdom data for child builder', () => {
          render((_) => _
              .child('foobar', (_) => _
                  .peek((ctx) => {
                      const expected = {
                          tag: 'foobar',
                          value: null,
                          text: '',
                          events: {},
                          props: {},
                          children: [],
                      };
                      expect(ctx).to.deep.equal(expected);
                  }),
              ),
          );
      });
    });
});
