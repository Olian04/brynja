import { expect } from 'chai';

import { buildNode } from './builder';

describe('builder', () => {
    it('typecheck', () => {
        expect(typeof buildNode).to.equal('function');
        // TODO: Move operation tests from brynja.test.ts to here
    });
});
