import { expect } from 'chai';
import { describe } from 'mocha';

// tslint:disable-next-line:no-var-requires
const jsdom: () => void = require('mocha-jsdom');

import { render } from '../../src/brynja';

describe('Integrations test', () => {
    jsdom();

    beforeEach(() => {
        document.body.innerHTML = '<div id="root"></div>';
    });

    describe('Effect free operations', ()  => {
        it('peek', () => {
            render((_) => _
                .peek((ctx) => {
                    const expected = { tag: 'div', value: null,  text: '', events: {}, props: {}, children: [] };
                    expect(ctx).to.deep.equal(expected);
                })
                .child('foobar', (_) => _
                    .peek((ctx) => {
                        const expected = {
                            tag: 'foobar',
                            value: null,
                            text: '',
                            events: {},
                            props: {},
                            children: [],
                        };
                        expect(ctx).to.deep.equal(expected);
                    }),
                ),
            );
        });
    });
});
