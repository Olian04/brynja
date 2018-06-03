import { expect } from 'chai';
import jsdom from 'mocha-jsdom';

import { buildNode } from './builder';

describe('builder', () => {
    it('typecheck', () => {
        expect(typeof buildNode).to.equal('function');
        // TODO: Move operation tests from paramus-render.test.ts to here
    })
});