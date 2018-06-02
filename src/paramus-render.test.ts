import { expect } from 'chai';
import jsdom from 'mocha-jsdom';

import { render } from './paramus-render';
import { describe } from 'mocha';

describe('paramus-render', () => {
    jsdom();

    function testCtx(ctx) {
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
        return ctx;
    }

    let root: HTMLElement;
    before(() => {
        root = document.createElement('div')
    });

    it('typecheck', () => {
        expect(typeof render).to.equal('function');
        render(root, testCtx);
    });

    describe('operations', () => {
        describe('nested ctx', () => {
            it('child', () => {
                render(root, _=>_ 
                    .child('div', testCtx)
                );
            });
            it('children', () => {
                render(root, _=>_ 
                    .children('li', 1, testCtx)
                );
            });
            it('when', () => {
                render(root, _=>_ 
                    .when(() => true, testCtx, ctx => { expect.fail(); return ctx; })
                    .when(() => false,  ctx => { expect.fail(); return ctx; }, testCtx)
                );
            });
        });

        describe('mutating', ()  => {
            it('id', () => {
                it('when', () => {
                    render(root, _=>_ 
                        .id('hello')
                        .id('world')
                    );
                });
            });
        });
    });

});