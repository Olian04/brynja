import { expect } from 'chai';
import { describe } from 'mocha';
import jsdom from 'mocha-jsdom';

import { BuilderCTX } from './builder';
import { render, Renderer } from './brynja';
import { Events } from './util/events';

describe('paramus-render', () => {
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
            'do'
        ];
        let i = 0;
        expect(ctx).to.not.be.undefined;
        expect(typeof ctx).to.equal('object');
        funcs.forEach(f => {
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
                render(_=>_ 
                    .child('div', testBuilder)
                );
            });
            it('children', () => {
                const targetCount = 3;
                let counter = 0;
                render(_=>_ 
                    .children('li', targetCount, (_, i) => {
                        testBuilder(_);
                        expect(i).to.equal(counter);
                        counter++;
                    })
                );
                expect(counter).to.equal(targetCount);
            });
        });

        describe('Mutation ops', ()  => {
            it('id', () => {
                render(_=>_ 
                    .peek(ctx => {
                        expect(ctx.props['id']).to.be.undefined;
                    })
                    .id('hello')
                    .peek(ctx => {
                        expect(ctx.props['id']).to.equal('hello');
                    })
                    .id('world')
                    .peek(ctx => {
                        expect(ctx.props['id']).to.equal('world');
                    })
                );
            });
            it('class', () => {
                render(_=>_ 
                    .peek(ctx => {
                        expect(ctx.props['class']).to.be.undefined;
                    })
                    .class([ 'hello' ])
                    .peek(ctx => {
                        expect(ctx.props['class']).to.equal('hello');
                    })
                    .class([ 'world' ])
                    .peek(ctx => {
                        expect(ctx.props['class']).to.equal('hello world');
                    })
                );
            });
            it('name', () => {
                render(_=>_ 
                    .peek(ctx => {
                        expect(ctx.props['name']).to.be.undefined;
                    })
                    .name('hello')
                    .peek(ctx => {
                        expect(ctx.props['name']).to.deep.equal('hello');
                    })
                    .name('world')
                    .peek(ctx => {
                        expect(ctx.props['name']).to.equal('world');
                    })
                );
            });
            it('text', () => {
                render(_=>_ 
                    .peek(ctx => {
                        expect(ctx.text).to.deep.equal('');
                    })
                    .text('hello')
                    .peek(ctx => {
                        expect(ctx.text).to.deep.equal('hello');
                    })
                    .text('world')
                    .peek(ctx => {
                        expect(ctx.text).to.equal('world');
                    })
                );
            });
            
            it('value', () => {
                render(_=>_ 
                    .peek(ctx => {
                        expect(ctx.value).to.be.null;
                    })
                    .value('hello')
                    .peek(ctx => {
                        expect(ctx.value).to.equal('hello');
                    })
                    .value(5)
                    .peek(ctx => {
                        expect(ctx.value).to.equal(5);
                    })
                );
            });
            it('prop', () => {
                render(_=>_ 
                    .peek(ctx => {
                        expect(ctx.props['foobar']).to.be.undefined;
                    })
                    .prop('foobar', 'hello')
                    .peek(ctx => {
                        expect(ctx.props['foobar']).to.equal('hello');
                    })
                    .prop('foobar', 'world')
                    .peek(ctx => {
                        expect(ctx.props['foobar']).to.equal('world');
                    })
                );
            });
            it('on', () => {
                render(_=>_ 
                    .peek(ctx => {
                        expect(ctx.events['foobar']).to.be.undefined;
                    })
                    .on('foobar', () => 'hello')
                    .peek(ctx => {
                        expect(ctx.events['foobar']).to.have.length(1);
                        expect(ctx.events['foobar'][0]({})).to.equal('hello');
                    })
                    .on('foobar', () => 'world')
                    .peek(ctx => {
                        expect(ctx.events['foobar']).to.have.length(2);
                        expect(ctx.events['foobar'][0]({})).to.equal('hello');
                        expect(ctx.events['foobar'][1]({})).to.equal('world');
                    })
                );
            });
        });

        describe('Control flow ops', ()  => {
            it('when', () => {
                render(_=>_ 
                    .when(() => true, testBuilder, () => expect.fail())
                    .when(() => false,  () => expect.fail(), testBuilder)
                );
            });
            it('while', () => {
                let targetCount = 3;
                let counter = 0;
                render(_=>_ 
                    .while(i => i < targetCount, (_, i) => {
                        testBuilder(_);
                        expect(i).to.equal(counter);
                        counter++;
                    })
                    .while(() => false, () => expect.fail())
                );
                expect(counter).to.equal(targetCount);
            });
            it('do', () => {
                const test1 = function(_: BuilderCTX) {
                    _.value('hello')
                }
                const test2 = (_: BuilderCTX) =>_
                    .child('foo', () => {});
                function test3(_: BuilderCTX) {
                    _.id('world')
                }
                render(_=>_ 
                    .do(
                        testBuilder,
                        test1
                    )
                    .peek(ctx => {
                        expect(ctx.value).to.equal('hello');
                    })
                    .do(test2)
                    .peek(ctx => {
                        expect(ctx.value).to.equal('hello');
                        expect(ctx.children).to.be.of.length(1);
                        expect(ctx.children[0].tag).to.equal('foo');
                    })
                    .do(test3)
                    .peek(ctx => {
                        expect(ctx.value).to.equal('hello');
                        expect(ctx.children).to.be.of.length(1);
                        expect(ctx.children[0].tag).to.equal('foo');
                        expect(ctx.props['id']).to.equal('world');
                    })
                );
            });
        });

        describe('Effect free ops', ()  => {
            it('peek', () => {
                render(_=>_ 
                    .peek(ctx => {
                        const expected = { tag: 'div', value: null,  text: '', events: {}, props: {}, children: [] };
                        expect(ctx).to.deep.equal(expected);
                    })
                    .child('foobar', _=>_ 
                        .peek(ctx => {
                            const expected = { tag: 'foobar', value: null,  text: '', events: {},  props: {}, children: [] };
                            expect(ctx).to.deep.equal(expected);
                        })
                    )
                );
            });
        });

        describe('extension operations', () => {
            it('hello world', () => {
                const { render, extend } = Renderer({
                    rootElement: document.getElementById('root'),
                    vdomRootType: 'div'
                });
                extend('hello', (name: string) => _=>_
                    .child('p', _=>_
                        .text(`Hello ${name}!`)
                    )
                );
                render(_=>_
                    .hello('Oliver')
                    .hello('world')
                    .peek(ctx => {
                        expect(ctx.children[0].tag).to.equal('p');
                        expect(ctx.children[0].text).to.equal('Hello Oliver!');

                        expect(ctx.children[1].tag).to.equal('p');
                        expect(ctx.children[1].text).to.equal('Hello world!');
                    })
                );
            });
        });
        describe('updating a render', ()=> {
            it('child update', () => {
                const root = document.createElement('div');
                const { render } = Renderer({
                    rootElement: root,
                    vdomRootType: 'div'
                });

                render(_=>_
                    .child('h1', _=>_)
                );
                expect(root.firstElementChild.firstElementChild.nodeName).to.equal('H1');
                
                render(_=>_
                    .child('p', _=>_)
                );
                expect(root.firstElementChild.firstElementChild.nodeName).to.equal('P'); 
            });

            it('prop update', () => {
                const root = document.createElement('div');
                const { render } = Renderer({
                    rootElement: root,
                    vdomRootType: 'div'
                });

                render(_=>_
                    .child('div', _=>_
                        .prop('bar', 'foo')
                    )
                );
                expect(root.firstElementChild.firstElementChild.nodeName).to.equal('DIV');
                expect(root.firstElementChild.firstElementChild.hasAttribute('bar'), 'rootElement should contain attribute "bar"').to.be.true; // TODO: This fails, why? I can't see why it would fail? Does it have to do with something like "requestAnimationFrame"?
                expect(root.firstElementChild.firstElementChild.getAttribute('bar'), 'Attribute "bar" should have value "foo"').to.equal('foo');

                render(_=>_
                    .child('div', _=>_
                        .prop('foo', 'bar')
                    )
                );
                expect(root.firstElementChild.firstElementChild.nodeName).to.equal('DIV');
                expect(root.firstElementChild.firstElementChild.hasAttribute('bar'), 'rootElement should not contain attribute "bar"').to.be.false;
                expect(root.firstElementChild.firstElementChild.hasAttribute('foo'), 'rootElement should contain attribute "foo"').to.be.true;
                expect(root.firstElementChild.firstElementChild.getAttribute('foo'), 'Attribute "foo" should have value "bar"').to.equal('bar');
            });

            it('event update', () => {
                const root = document.createElement('div');
                const { render } = Renderer({
                    rootElement: root,
                    vdomRootType: 'div'
                });

                let counter = 0;

                render(_=>_
                    .child('div', _=>_
                        .on(Events.Mouse.Click, () => {
                            if (counter > 0) {
                                expect.fail('Should fail');
                            }
                            counter++;
                        })
                    )
                );
                //@ts-ignore
                root.firstElementChild.firstElementChild.dispatchEvent(new window.Event('click'));
                
                render(_=>_
                    .child('div', _=>_
                        .on(Events.Mouse.Click, () => {
                            counter += 100;
                        })
                    )
                );
                //@ts-ignore
                root.firstElementChild.firstElementChild.dispatchEvent(new window.Event('click'));
                expect(counter).to.equal(100);
            });
        });
    });
});