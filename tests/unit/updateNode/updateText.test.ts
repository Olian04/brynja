import { describe, it } from 'mocha';
import { expect } from 'chai';

// tslint:disable-next-line:no-var-requires
const jsdom: () => void = require('mocha-jsdom');

import { buildNode } from '../../../src/builder';
import { renderNode } from '../../../src/renderNode';
import { updateNode } from '../../../src/updateNode';

describe('Update text', () => {
    jsdom();
    describe('Single update', () => {
        it('should update from empty text to non-empty text', () => {
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
        it('should update from non-empty text to empty text', () => {
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
        it('should update from one non-empty text to another', () => {
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
    });
    describe('Multiple updates', () => {
      it('should update text after children changes', () => {
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
      });
    });
});
