import { expect } from 'chai';

import { Renderer } from './renderer';

describe('renderer', () => {
    it('typecheck', () => {
        expect(typeof Renderer).to.equal('function');
    });
});
