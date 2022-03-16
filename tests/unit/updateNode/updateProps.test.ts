import { describe, it } from 'mocha';
import { expect } from 'chai';

// tslint:disable-next-line:no-var-requires
const jsdom: () => void = require('mocha-jsdom');

import { buildNode } from '../../../src/builder';
import { renderNode } from '../../../src/renderNode';
import { updateNode } from '../../../src/updateNode';

describe('Update Props', () => {
    jsdom();

    describe('Single update', () => {
        it('should update prop value for one prop', () => {
            const [vdiv1] = buildNode('h1', (_) => _
                .prop('foo', 'foo'),
            );
            const $div =  renderNode(vdiv1);
            expect($div.getAttribute('foo')).to.equal('foo');

            const [vdiv2] = buildNode('h1', (_) => _
                .prop('foo', 'bar'),
            );
            updateNode(vdiv2, vdiv1, $div);
            expect($div.getAttribute('foo')).to.equal('bar');
        });
    });
});
