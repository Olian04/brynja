import { expect } from 'chai';
import { describe } from 'mocha';

// tslint:disable-next-line:no-var-requires
const jsdom: () => void = require('mocha-jsdom');

import { createComponent, render } from '../../src/brynja';
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

    describe('Control flow operations', ()  => {
      describe('when', () => {
        it('should run TRUE builder when predicate is true', () => {
            render((_) => _
                .when(true, testBuilder, () => expect.fail())
            );
        });
        it('should run FALSE builder when predicate is false', () => {
          render((_) => _
              .when(false,  () => expect.fail(), testBuilder),
          );
        });
        it('should only run TRUE or FALSE builder never both', () => {
          render((_) => _
              .when(true, testBuilder, () => expect.fail())
              .when(false,  () => expect.fail(), testBuilder),
          );
        });
        it('ELSE builder should be optional', () => {
          try {
            render((_) => _
                .when(true, _=>_)
            );
          } catch {
            expect.fail();
          }
      });
      });

      describe('while', () => {
        it('should pass test builder for each iteration', () => {
            const targetCount = 3;
            let counter = 0;
            render((_) => _
                .while((i) => i < targetCount, (_, i) => {
                    testBuilder(_);
                    expect(i).to.equal(counter);
                    counter++;
                })
            );
            expect(counter).to.equal(targetCount);
        });
        it('should only run builder when predicate is true', () => {
          render((_) => _
              .while(() => false, () => expect.fail()),
          );
        });
      });

      describe('do', () => {
        it('should run any builder function passed to it', () => {
            // tslint:disable-next-line only-arrow-functions
            const test1 = function(_: IBuilderCTX) {
                _.value('hello');
            };
            const test2 = createComponent(() => (_) => _
                .child('foo', () => { /* */ }),
            );
            function test3(_: IBuilderCTX) {
                _.id('world');
            }
            render((_) => _
                .do(
                    testBuilder,
                    test1,
                )
                .peek((ctx) => {
                    expect(ctx.value).to.equal('hello');
                })
                .do(test2())
                .peek((ctx) => {
                    expect(ctx.value).to.equal('hello');
                    expect(ctx.children).to.be.of.length(1);
                    expect(ctx.children[0].tag).to.equal('foo');
                })
                .do(test3)
                .peek((ctx) => {
                    expect(ctx.value).to.equal('hello');
                    expect(ctx.children).to.be.of.length(1);
                    expect(ctx.children[0].tag).to.equal('foo');
                    expect(ctx.props.id).to.equal('world');
                }),
            );
        });
      });
    });
});
