import { describe, it } from 'mocha';
import { expect } from 'chai';

// tslint:disable-next-line:no-var-requires
const jsdom: () => void = require('mocha-jsdom');

import { renderNode } from '../../../src/renderNode';

describe('Render root node', () => {
    jsdom();

    it('should generated a root element', () => {
        const div =  renderNode({
            tag: 'div', text: '', value: null, events: {}, props: {}, children: [],
        });
        expect(div.tagName).to.equal('DIV');
    });
});
