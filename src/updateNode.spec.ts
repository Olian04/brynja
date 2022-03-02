import { expect } from 'chai';

// tslint:disable-next-line:no-var-requires
const jsdom: () => void = require('mocha-jsdom');

import { buildNode } from './builder';
import { renderNode } from './renderNode';
import { updateNode } from './updateNode';
import { Events } from './util/events';

describe('updateNode', () => {
    jsdom();

    it('typecheck', () => {
        expect(typeof updateNode).to.equal('function');
    });

    describe('Single update', () => {
        it('text from empty', () => {
            const [vdiv1] = buildNode('h1', (_) => _
                .text(''),
            );
            const $div =  renderNode(vdiv1);
            expect($div.textContent).to.equal('');

            const [vdiv2] = buildNode('h1', (_) => _
                .text('Hello World'),
            );
            updateNode(vdiv2, vdiv1, $div);
            expect($div.textContent).to.equal('Hello World');
        });
        it('text to empty', () => {
            const [vdiv1] = buildNode('h1', (_) => _
                .text('Hello World'),
            );
            const $div =  renderNode(vdiv1);
            expect($div.textContent).to.equal('Hello World');

            const [vdiv2] = buildNode('h1', (_) => _
                .text(''),
            );
            updateNode(vdiv2, vdiv1, $div);
            expect($div.textContent).to.equal('');
        });
        it('text to other', () => {
            const [vdiv1] = buildNode('h1', (_) => _
                .text('Hello World'),
            );
            const $div =  renderNode(vdiv1);
            expect($div.textContent).to.equal('Hello World');

            const [vdiv2] = buildNode('h1', (_) => _
                .text('Hello You!'),
            );
            updateNode(vdiv2, vdiv1, $div);
            expect($div.textContent).to.equal('Hello You!');
        });

        it('prop to other', () => {
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

        it('on remove listener', () => {
            let eventTriggered = false;
            const originalVDOM =  buildNode('div', (_) => _
                .on(Events.Mouse.Click, () => {
                    eventTriggered = true;
                }),
            )[0];

            const div = renderNode(originalVDOM);

            const newVDOM = buildNode('div', (_) => _)[0];

            updateNode(newVDOM, originalVDOM, div);

            // @ts-ignore
            div.dispatchEvent(new window.Event(Events.Mouse.Click));
            console.log('After Dispatch');

            expect(eventTriggered, 'Failed to remove event listener').to.be.false;
        });

        it('on add listener', () => {
            let eventTriggered = false;
            const originalVDOM =  buildNode('div', (_) => _)[0];

            const div = renderNode(originalVDOM);

            const newVDOM = buildNode('div', (_) => _
                .on(Events.Mouse.Click, () => eventTriggered = true),
            )[0];

            updateNode(newVDOM, originalVDOM, div);

            // @ts-ignore
            div.dispatchEvent(new window.Event(Events.Mouse.Click));

            expect(eventTriggered, 'Failed to add event listener').to.be.true;
        });

        it('on update listener', () => {
            let eventTriggeredValue = 'none';
            const originalVDOM =  buildNode('div', (_) => _
                .on(Events.Mouse.Click, () => eventTriggeredValue = 'wrong'),
            )[0];

            const div = renderNode(originalVDOM);

            const newVDOM = buildNode('div', (_) => _
                .on(Events.Mouse.Click, () => eventTriggeredValue = 'right'),
            )[0];

            updateNode(newVDOM, originalVDOM, div);

            // @ts-ignore
            div.dispatchEvent(new window.Event(Events.Mouse.Click));

            expect(eventTriggeredValue, 'Failed to update listener').to.equal('right');
        });
    });
    it('Multiple sequential updates', () => {
        const [vElem1] = buildNode('h1', (_) => _
            .text('Hello World'),
        );
        const $elem = renderNode(vElem1);
        expect($elem.tagName).to.equal('H1');
        expect($elem.children.length).to.equal(0);
        if ($elem.firstChild === null) {
            expect.fail();
        } else {
            expect($elem.firstChild.textContent).to.equal('Hello World');
        }

        const [vElem2] = buildNode('h1', (_) => _
            .text('Hello')
            .child('div', (_) => _
                .text('World'),
            ),
        );
        updateNode(vElem2, vElem1, $elem);
        expect($elem.tagName).to.equal('H1');
        expect($elem.children.length).to.equal(1);
        if ($elem.firstChild === null) {
            expect.fail();
        } else {
            expect($elem.firstChild.textContent).to.equal('Hello');
        }
        const $child = $elem.children[0] as HTMLElement;
        expect($child.tagName).to.equal('DIV');
        if ($child.firstChild === null) {
            expect.fail();
        } else {
            expect($child.firstChild.textContent).to.equal('World');
        }

        const [vElem3] = buildNode('h1', (_) => _
            .text('Hello World'),
        );
        updateNode(vElem3, vElem2, $elem);
        expect($elem.tagName).to.equal('H1');
        expect($elem.children.length).to.equal(0);
        if ($elem.firstChild === null) {
            expect.fail();
        } else {
            expect($elem.firstChild.textContent).to.equal('Hello World');
        }

        const [vElem4] = buildNode('h1', (_) => _
            .children('div', 5, (_, i) => _
                .text('' + i),
            ),
        );
        updateNode(vElem4, vElem3, $elem);
        expect($elem.children.length).to.equal(5);
    });
});
