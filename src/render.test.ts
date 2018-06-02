import { expect } from 'chai';
import jsdom from 'mocha-jsdom';

import { render } from './render';

describe('render', () => {
    it('typecheck', () => {
        expect(typeof render).to.equal('function');
    })
});