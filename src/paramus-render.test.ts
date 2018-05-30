import { expect } from 'chai';
import jsdom from 'mocha-jsdom';

import { render } from './paramus-render';

describe('paramus-render', () => {
    jsdom();
    it('typecheck', () => {
        expect(typeof render).to.equal('function');
        document.body.innerHTML = '<div id="root"></div>'
        const funcs = [
            'child', 'children', 
            'id', 'name', 'class',
            'value', 'prop', 'when',
            'on'
        ];
        let i = 0;
        render('root', ctx => {
            expect(ctx).to.not.be.undefined;
            funcs.forEach(f => {
                expect(ctx).to.have.key(f);
                expect(typeof ctx[f]).to.equal('function');
                i++;
            });
        });
        expect(i).to.equal(funcs.length);
    })
});