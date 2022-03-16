import { describe, it } from 'mocha';
import { expect } from 'chai';

// tslint:disable-next-line:no-var-requires
const jsdom: () => void = require('mocha-jsdom');

import { BuilderCB, buildNode } from '../../../src/builder';

describe('Build styles', () => {
    jsdom();

    it('should render styles for a single property applied once', () => {
        const inputStyle = {
            background: 'orangered',
        };
        const builder: BuilderCB = (_) => _
            .style(inputStyle);
        const [vdom, styles] = buildNode('div', builder);

        const styleClasses = Object.keys(styles);
        expect(styleClasses.length).to.equal(1);
        expect(vdom.props.class).to.deep.equal(styleClasses[0]);

        const styleObj = styles[styleClasses[0]];
        expect(styleObj).to.deep.equal(inputStyle);
    });
});
