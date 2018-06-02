import { expect } from 'chai';
import jsdom from 'mocha-jsdom';

import { BuilderCTX } from './builder';
import { render } from './paramus-render';
import { describe } from 'mocha';

describe('paramus-render', () => {
    jsdom();

    function testBuilder(ctx) {
        const funcs = [
            'child', 'children', 
            'id', 'name', 'class',
            'value', 'prop', 'when',
            'on'
        ];
        let i = 0;
        expect(ctx).to.not.be.undefined;
        funcs.forEach(f => {
            expect(ctx).to.have.haveOwnProperty(f);
            expect(typeof ctx[f]).to.equal('function');
            i++;
        });
        expect(i).to.equal(funcs.length);
    }

    let root: HTMLElement;
    before(() => {
        root = document.createElement('div')
    });

    it('typecheck', () => {
        expect(typeof render).to.equal('function');
        render(root, testBuilder);
    });

    describe('operations', () => {
        describe('Nesting ops', () => {
            it('child', () => {
                render(root, _=>_ 
                    .child('div', testBuilder)
                );
            });
            it('children', () => {
                render(root, _=>_ 
                    .children('li', 3, testBuilder)
                );
            });
        });

        describe('Mutation ops', ()  => {
            it('id', () => {
                render(root, _=>_ 
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
                render(root, _=>_ 
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
                render(root, _=>_ 
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
            it('value', () => {
                render(root, _=>_ 
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
                render(root, _=>_ 
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
                render(root, _=>_ 
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
                render(root, _=>_ 
                    .when(() => true, testBuilder, () => expect.fail())
                    .when(() => false,  () => expect.fail(), testBuilder)
                );
            });
            it('while', () => {
                let targetCount = 3;
                let counter = 0;
                render(root, _=>_ 
                    .while(i => i < targetCount, testBuilder)
                    .while(i => i < targetCount, (_, i) => {
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
                render(root, _=>_ 
                    .do(testBuilder)
                    .do(test1)
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
                render(root, _=>_ 
                    .peek(ctx => {
                        const expected = { tag: null, value: null, events: {}, props: {}, children: [] };
                        expect(ctx).to.deep.equal(expected);
                    })
                    .child('foobar', _=>_ 
                        .peek(ctx => {
                            const expected = { tag: 'foobar', value: null, events: {}, props: {}, children: [] };
                            expect(ctx).to.deep.equal(expected);
                        })
                    )
                );
            });
        });
    });

});