import { expect } from 'chai';
import { describe } from 'mocha';
import jsdom from 'mocha-jsdom';

import { builder, render, Renderer } from './brynja';
import { IBuilderCTX } from './interfaces/BuilderCTX';
import { Events } from './util/events';

describe('brynja', () => {
    jsdom();

    beforeEach(() => {
        document.body.innerHTML = '<div id="root"></div>';
    });

    function testBuilder(ctx) {
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
            expect(typeof ctx[f]).to.equal('function');
            i++;
        });
        expect(i).to.equal(funcs.length);
    }

    it('typecheck', () => {
        expect(typeof render).to.equal('function');
        render(testBuilder);
    });

    describe('operations', () => {
        describe('Nesting ops', () => {
            it('child', () => {
                render((_) => _
                    .child('div', testBuilder),
                );
            });
            it('children - number', () => {
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
            it('children - array', () => {
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
        });

        describe('Mutation ops', ()  => {
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
                expect(conf.rootElement.lastChild.nodeName).to.equal('STYLE');
                expect(conf.rootElement.lastChild.textContent).to.equal('');

                // One style
                render((_) => _
                    .id('style-root')
                    .style({
                        background: 'red',
                    }),
                );
                expect(conf.rootElement.lastChild.nodeName).to.equal('STYLE');
                expect(conf.rootElement.lastChild.textContent).to.equal('.brynja-0aaeba391250c07deb384c0a7b7285604d53946e{background: red;}');

                // Multiple styles
                render((_) => _
                    .id('style-root')
                    .style({
                        background: 'red',
                        color: 'blue',
                    }),
                );
                expect(conf.rootElement.lastChild.nodeName).to.equal('STYLE');
                expect(conf.rootElement.lastChild.textContent).to.equal('.brynja-e5faf53cd44644de5df0522498cb9302b9db722e{background: red;color: blue;}');
            });
        });

        describe('Control flow ops', ()  => {
            it('when', () => {
                render((_) => _
                    .when(true, testBuilder, () => expect.fail())
                    .when(false,  () => expect.fail(), testBuilder),
                );
            });
            it('while', () => {
                const targetCount = 3;
                let counter = 0;
                render((_) => _
                    .while((i) => i < targetCount, (_, i) => {
                        testBuilder(_);
                        expect(i).to.equal(counter);
                        counter++;
                    })
                    .while(() => false, () => expect.fail()),
                );
                expect(counter).to.equal(targetCount);
            });
            it('do', () => {
                // tslint:disable-next-line only-arrow-functions
                const test1 = function(_: IBuilderCTX) {
                    _.value('hello');
                };
                const test2 = builder((_) => _
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
                    .do(test2)
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

        describe('Effect free ops', ()  => {
            it('peek', () => {
                render((_) => _
                    .peek((ctx) => {
                        const expected = { tag: 'div', value: null,  text: '', events: {}, props: {}, children: [] };
                        expect(ctx).to.deep.equal(expected);
                    })
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

        describe('updating a render', () => {
            it('child update', () => {
                const config = {
                    rootElement: document.getElementById('root'),
                };
                const { render } = Renderer(config);

                render((_) => _
                    .child('h1', (_) => _),
                );
                expect(config.rootElement.firstElementChild.nodeName).to.equal('H1');

                render((_) => _
                    .child('p', (_) => _),
                );
                expect(config.rootElement.firstElementChild.nodeName).to.equal('P');
            });

            it('prop update', () => {
                const config = {
                    rootElement: document.getElementById('root'),
                };
                const { render } = Renderer(config);

                render((_) => _
                    .child('div', (_) => _
                        .prop('bar', 'foo'),
                    ),
                );
                expect(config.rootElement.firstElementChild.nodeName).to.equal('DIV');
                expect(
                    config.rootElement.firstElementChild.hasAttribute('bar'),
                    'rootElement should contain attribute "bar"',
                ).to.be.true;
                expect(
                    config.rootElement.firstElementChild.getAttribute('bar'),
                    'Attribute "bar" should have value "foo"',
                ).to.equal('foo');

                render((_) => _
                    .child('div', (_) => _
                        .prop('foo', 'bar'),
                    ),
                );
                expect(config.rootElement.firstElementChild.nodeName).to.equal('DIV');
                expect(
                    config.rootElement.firstElementChild.hasAttribute('bar'),
                    'rootElement should not contain attribute "bar"',
                ).to.be.false;
                expect(
                    config.rootElement.firstElementChild.hasAttribute('foo'),
                    'rootElement should contain attribute "foo"',
                ).to.be.true;
                expect(
                    config.rootElement.firstElementChild.getAttribute('foo'),
                    'Attribute "foo" should have value "bar"',
                ).to.equal('bar');
            });

            it('event update', () => {
                const config = {
                    rootElement: document.getElementById('root'),
                };
                const { render } = Renderer(config);

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

                config.rootElement.firstElementChild.dispatchEvent(
                    // @ts-ignore
                    new window.Event('click'),
                );
                expect(counter).to.equal(1);

                render((_) => _
                    .child('div', (_) => _
                        .on(Events.Mouse.Click, () => {
                            counter += 100;
                        }),
                    ),
                );

                config.rootElement.firstElementChild.dispatchEvent(
                    // @ts-ignore
                    new window.Event('click'),
                );
                expect(counter).to.equal(101);
            });
        });
    });
});
