import { expect } from 'chai';
import jsdom from 'mocha-jsdom';

import { findDelta } from './delta';

describe('delta', () => {
    it('typecheck', () => {
        expect(typeof findDelta).to.equal('function');
    })
});