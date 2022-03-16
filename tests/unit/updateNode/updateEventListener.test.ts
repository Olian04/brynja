import { describe, it } from 'mocha';
import { expect } from 'chai';

// tslint:disable-next-line:no-var-requires
const jsdom: () => void = require('mocha-jsdom');

import { buildNode } from '../../../src/builder';
import { renderNode } from '../../../src/renderNode';
import { updateNode } from '../../../src/updateNode';
import { Events } from '../../../src/util/events';

describe('Update event listener', () => {
    jsdom();

    describe('Single update', () => {
        it('should remove event listener when missing on new vDOM', () => {
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

            expect(eventTriggered, 'Failed to remove event listener').to.be.false;
        });

        it('should add event listener when present on new vDOM', () => {
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

        it('should update event listener when present on both old and new vDOM', () => {
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
});
