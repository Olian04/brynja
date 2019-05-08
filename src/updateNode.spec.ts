import { expect } from 'chai';
import jsdom from 'mocha-jsdom';

import { buildNode } from './builder';
import { renderNode } from './renderNode';
import { Events } from './util/events';

describe('render', () => {
    jsdom();

    describe('Updating', () => {
        it('Single update', () => {
            let div =  renderNode(buildNode('h1', (_) => _
                .text('Hello World')
            , {}));
            expect(div.tagName).to.equal('H1');
            expect(div.children.length).to.equal(0);
            expect(div.firstChild.textContent).to.equal('Hello World');
            div =  renderNode(buildNode('h1', (_) => _
                .text('Hello')
                .child('div', (_) => _
                    .text('World'),
                )
            , {}));
            expect(div.tagName).to.equal('H1');
            expect(div.children.length).to.equal(1);
            expect(div.firstChild.textContent).to.equal('Hello');
            expect((div.children[0] as HTMLElement).tagName).to.equal('DIV');
            expect((div.children[0] as HTMLElement).firstChild.textContent).to.equal('World');
            div =  renderNode(buildNode('h1', (_) => _
                .text('Hello World')
            , {}));
            expect(div.tagName).to.equal('H1');
            expect(div.children.length).to.equal(0);
            expect(div.firstChild.textContent).to.equal('Hello World');

            div =  renderNode(buildNode('div', (_) => _
                .children('div', 5, (_, i) => _
                    .text('' + i),
                )
            , {}));
            expect(div.children.length).to.equal(5);
        });
    });
});
