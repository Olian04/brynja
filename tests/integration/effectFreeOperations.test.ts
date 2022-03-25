import { AssertionError, expect } from 'chai';
import { describe } from 'mocha';

// tslint:disable-next-line:no-var-requires
const jsdom: () => void = require('mocha-jsdom');

import { render } from '../../src/brynja';
import { BrynjaError } from '../../src/util/BrynjaError';

describe('Integrations test', () => {
  jsdom();

  beforeEach(() => {
    document.body.innerHTML = '<div id="root"></div>';
  });

  describe('Effect free operations', () => {
    it('peek should return correct vdom data for root builder', () => {
      render((_) =>_
        .peek((ctx) => {
          const expected = {
            tag: 'div',
            value: null,
            text: '',
            events: {},
            props: {},
            children: [],
          };
          expect(ctx).to.deep.equal(expected);
        })
      );
    });
    it('peek should be able to access vdom of children', () => {
      render((_) =>_
        .children('div', 3, (_, i) =>_
          .text(i)
        )
        .peek((ctx) => {
          expect(ctx.children.length).to.equal(3);
          expect(ctx.children[0].text).to.equal('0');
          expect(ctx.children[1].text).to.equal('1');
          expect(ctx.children[2].text).to.equal('2');
        })
      );
    });
    it('peek should return correct vdom data for child builder', () => {
      render((_) =>_
        .child('foobar', (_) =>_
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
          })
        )
      );
    });
    it('peek should throw when accessing disallowed property from children proxy', () => {
      render((_) =>_
        .child('foobar', (_) =>_
          .peek((ctx) => {
            try {
              ctx.children.fill;
              expect.fail();
            } catch (e) {
              if (e instanceof AssertionError) {
                // Pass through assertion error
                throw e;
              }
              expect(e).to.be.instanceof(BrynjaError);
            }
          })
        )
      );
    });
  });
});
