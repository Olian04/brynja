import { expect } from 'chai';
import { describe } from 'mocha';

// tslint:disable-next-line:no-var-requires
const jsdom: () => void = require('mocha-jsdom');

import { render, Renderer } from '../../src/brynja';
import { IBuilderCTX } from '../../src/interfaces/BuilderCTX';

describe('Integrations test', () => {
    jsdom();

    beforeEach(() => {
        document.body.innerHTML = '<div id="root"></div>';
    });

    function testBuilder(ctx: IBuilderCTX) {
        const funcs = [
            'child', 'children',
            'id', 'name', 'class',
            'value', 'prop', 'when',
            'on', 'peek', 'text', 'while',
            'do', 'style',
        ];
        let i = 0;
        expect(ctx).to.not.be.undefined;
        expect(typeof ctx).to.equal('object');
        funcs.forEach((f) => {
            expect(ctx).to.have.haveOwnProperty(f);
            expect(typeof ctx[f as keyof IBuilderCTX]).to.equal('function');
            i++;
        });
        expect(i).to.equal(funcs.length);
    }


    describe('Nesting operations', () => {
        it('root build context should pass test builder', () => {
            expect(typeof render).to.equal('function');
            render(testBuilder);
        });

        it('child builder context should pass test builder', () => {
            render((_) => _
                .child('div', testBuilder),
            );
        });

        it('each children builder context should pass test builder - number', () => {
            const targetCount = 3;
            let counter = 0;
            render((_) => _
                .children('li', targetCount, (_, i) => {
                    testBuilder(_);
                    expect(i).to.equal(counter);
                    counter++;
                }),
            );
            expect(counter).to.equal(targetCount);
        });

        it('each children builder context should pass test builder - array', () => {
            const items = ['a', 'b', 'c'];
            let index = 0;
            render((_) => _
                .children('li', items, (_, item) => {
                    testBuilder(_);
                    expect(item).to.equal(items[index]);
                    index++;
                }),
            );
            expect(index).to.equal(items.length);
        });

        it('should update single child correctly when calling render twice with different builders', () => {
          const conf = {
              rootElement: document.createElement('div'),
          };
          const { render } = Renderer(conf);

          render((_) => _
              .child('h1', (_) => _),
          );
          if (conf.rootElement.firstElementChild === null) {
              expect.fail();
          } else {
              expect(conf.rootElement.firstElementChild.nodeName).to.equal('H1');
          }

          render((_) => _
              .child('p', (_) => _),
          );
          if (conf.rootElement.firstElementChild === null) {
              expect.fail();
          } else {
              expect(conf.rootElement.firstElementChild.nodeName).to.equal('P');
          }
      });
    });
});
