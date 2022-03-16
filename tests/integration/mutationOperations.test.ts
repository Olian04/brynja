import { expect } from 'chai';
import { describe } from 'mocha';

// tslint:disable-next-line:no-var-requires
const jsdom: () => void = require('mocha-jsdom');

import { createStyles, Events, render, Renderer } from '../../src/brynja';

describe('Integrations test', () => {
    jsdom();

    beforeEach(() => {
        document.body.innerHTML = '<div id="root"></div>';
    });

    describe('Mutation operations', ()  => {
      // TODO: Rewrite tests names so that they follow the "it should " pattern (see tests in other files for examples).
        it('id', () => {
            render((_) => _
                .peek((ctx) => {
                    expect(ctx.props.id).to.be.undefined;
                })
                .id('hello')
                .peek((ctx) => {
                    expect(ctx.props.id).to.equal('hello');
                })
                .id('world')
                .peek((ctx) => {
                    expect(ctx.props.id).to.equal('world');
                }),
            );
        });
        it('class', () => {
            render((_) => _
                .peek((ctx) => {
                    expect(ctx.props.class).to.be.undefined;
                })
                .class('hello')
                .peek((ctx) => {
                    expect(ctx.props.class).to.equal('hello');
                })
                .class('world')
                .peek((ctx) => {
                    expect(ctx.props.class).to.equal('hello world');
                }),
            );
        });
        it('name', () => {
            render((_) => _
                .peek((ctx) => {
                    expect(ctx.props.name).to.be.undefined;
                })
                .name('hello')
                .peek((ctx) => {
                    expect(ctx.props.name).to.deep.equal('hello');
                })
                .name('world')
                .peek((ctx) => {
                    expect(ctx.props.name).to.equal('world');
                }),
            );
        });
        it('text', () => {
            render((_) => _
                .peek((ctx) => {
                    expect(ctx.text).to.deep.equal('');
                })
                .text('hello')
                .peek((ctx) => {
                    expect(ctx.text).to.deep.equal('hello');
                })
                .text('world')
                .peek((ctx) => {
                    expect(ctx.text).to.equal('world');
                }),
            );
        });

        it('value', () => {
            render((_) => _
                .peek((ctx) => {
                    expect(ctx.value).to.be.null;
                })
                .value('hello')
                .peek((ctx) => {
                    expect(ctx.value).to.equal('hello');
                })
                .value(5)
                .peek((ctx) => {
                    expect(ctx.value).to.equal(5);
                }),
            );
        });
        it('prop', () => {
            render((_) => _
                .peek((ctx) => {
                    expect(ctx.props.foobar).to.be.undefined;
                })
                .prop('foobar', 'hello')
                .peek((ctx) => {
                    expect(ctx.props.foobar).to.equal('hello');
                })
                .prop('foobar', 'world')
                .peek((ctx) => {
                    expect(ctx.props.foobar).to.equal('world');
                }),
            );
        });
        it('on', () => {
            render((_) => _
                .peek((ctx) => {
                    expect(ctx.events.foobar).to.be.undefined;
                })
                .on('foobar', () => 'hello')
                .peek((ctx) => {
                    expect(ctx.events.foobar).to.have.length(1);
                    expect(ctx.events.foobar[0]({})).to.equal('hello');
                })
                .on('foobar', () => 'world')
                .peek((ctx) => {
                    expect(ctx.events.foobar).to.have.length(2);
                    expect(ctx.events.foobar[0]({})).to.equal('hello');
                    expect(ctx.events.foobar[1]({})).to.equal('world');
                }),
            );
        });
        it('style', () => {
            const conf = {
                rootElement: document.createElement('div'),
            };
            const { render } = Renderer(conf);

            // Initial empty render
            render((_) => _
                .id('style-root'),
            );
            expect(conf.rootElement.lastChild).to.equal(null);

            // Empty style
            render((_) => _
                .id('style-root')
                .style({}),
            );
            if (conf.rootElement.lastChild === null) {
                expect.fail();
            } else {
                expect(conf.rootElement.lastChild.nodeName).to.equal('STYLE');
                expect(conf.rootElement.lastChild.textContent).to.equal('');
            }

            // One style
            render((_) => _
                .id('style-root')
                .style({
                    background: 'red',
                }),
            );
            if (conf.rootElement.lastChild === null) {
                expect.fail();
            } else {
                expect(conf.rootElement.lastChild.nodeName).to.equal('STYLE');
                expect(conf.rootElement.lastChild.textContent).to.equal('.brynja-0aaeba391250c07deb384c0a7b7285604d53946e{background: red;}');
            }

            // Multiple styles
            render((_) => _
                .id('style-root')
                .style({
                    background: 'red',
                    color: 'blue',
                }),
            );
            if (conf.rootElement.lastChild === null) {
                expect.fail();
            } else {
                expect(conf.rootElement.lastChild.nodeName).to.equal('STYLE');
                expect(conf.rootElement.lastChild.textContent).to.equal('.brynja-e5faf53cd44644de5df0522498cb9302b9db722e{background: red;color: blue;}');
            }

            // Multiple styles using createStyles
            const SomeStyles = createStyles({
              background: 'red',
              color: 'blue',
            });
            render((_) => _
                .id('style-root')
                .style(SomeStyles),
            );
            if (conf.rootElement.lastChild === null) {
                expect.fail();
            } else {
                expect(conf.rootElement.lastChild.nodeName).to.equal('STYLE');
                expect(conf.rootElement.lastChild.textContent).to.equal('.brynja-e5faf53cd44644de5df0522498cb9302b9db722e{background: red;color: blue;}');
            }
        });

        it('prop update', () => {
          const conf = {
              rootElement: document.createElement('div'),
          };
          const { render } = Renderer(conf);

          render((_) => _
              .child('div', (_) => _
                  .prop('bar', 'foo'),
              ),
          );
          if (conf.rootElement.firstElementChild === null) {
              expect.fail();
          } else {
              expect(conf.rootElement.firstElementChild.nodeName).to.equal('DIV');
              expect(
                  conf.rootElement.firstElementChild.hasAttribute('bar'),
                  'rootElement should contain attribute "bar"',
              ).to.be.true;
              expect(
                  conf.rootElement.firstElementChild.getAttribute('bar'),
                  'Attribute "bar" should have value "foo"',
              ).to.equal('foo');
          }

          render((_) => _
              .child('div', (_) => _
                  .prop('foo', 'bar'),
              ),
          );
          if (conf.rootElement.firstElementChild === null) {
              expect.fail();
          } else {
              expect(conf.rootElement.firstElementChild.nodeName).to.equal('DIV');
              expect(
                  conf.rootElement.firstElementChild.hasAttribute('bar'),
                  'rootElement should not contain attribute "bar"',
              ).to.be.false;
              expect(
                  conf.rootElement.firstElementChild.hasAttribute('foo'),
                  'rootElement should contain attribute "foo"',
              ).to.be.true;
              expect(
                  conf.rootElement.firstElementChild.getAttribute('foo'),
                  'Attribute "foo" should have value "bar"',
              ).to.equal('bar');
          }
      });
      it('event update', () => {
        const conf = {
            rootElement: document.createElement('root'),
        };
        const { render } = Renderer(conf);

        let counter = 0;

        render((_) => _
            .child('div', (_) => _
                .on(Events.Mouse.Click, () => {
                    if (counter === 1) {
                        expect.fail('Should fail');
                    }
                    counter = 1;
                }),
            ),
        );

        if (conf.rootElement.firstElementChild === null) {
            expect.fail();
        } else {
            conf.rootElement.firstElementChild.dispatchEvent(
                // @ts-ignore
                new window.Event('click'),
            );
            expect(counter).to.equal(1);
        }

        render((_) => _
            .child('div', (_) => _
                .on(Events.Mouse.Click, () => {
                    counter += 100;
                }),
            ),
        );

        if (conf.rootElement.firstElementChild === null) {
            expect.fail();
        } else {
            conf.rootElement.firstElementChild.dispatchEvent(
                // @ts-ignore
                new window.Event('click'),
            );
            expect(counter).to.equal(101);
        }
    });
  });
});
