import { expect } from 'chai';

import { Renderer } from './renderer';

describe('builder', () => {
    it('typecheck', () => {
        expect(typeof Renderer).to.equal('function');
    });
});
