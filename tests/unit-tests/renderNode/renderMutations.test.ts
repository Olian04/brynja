import { expect } from 'chai';

// tslint:disable-next-line:no-var-requires
const jsdom: () => void = require('mocha-jsdom');

import { buildNode } from '../../../src/builder';
import { renderNode } from '../../../src/renderNode';
import { Events } from '../../../src/util/events';

describe('Render mutations', () => {
    jsdom();

    describe('id', () => {
      it('should add an ID to the dom element', () => {
          const div =  renderNode(buildNode('div', (_) => _
              .id('foo'),
          )[0]);
          expect(div.id).to.equal('foo');
      });
    });

    describe('class', ()  => {
      it('should add classes to the dom element', () => {
          const div =  renderNode(buildNode('div', (_) => _
              .class('foo', 'bar'),
           )[0]);
          expect(div.className).to.equal('foo bar');
      });
    });

    describe('value', () => {
      it('should update the value field of the element', () => {
          const button =  renderNode(buildNode('button', (_) => _
              .value('foo'),
          )[0]);
          // @ts-ignore
          expect(button.value).to.equal('foo');

          const div =  renderNode(buildNode('div', (_) => _
              .value('foo'),
          )[0]);
          // @ts-ignore
          expect(div.value).to.equal('foo');
      });
    });

    describe('name', () => {
      it('should add a name to the dom element', () => {
          const div =  renderNode(buildNode('div', (_) => _
              .name('foo'),
          )[0]);
          expect(div.getAttribute('name')).to.equal('foo');
      });
    });

    describe('text', () => {
      it('should append a text node as a child to the element', () => {
          const div =  renderNode(buildNode('div', (_) => _
              .text('foo'),
          )[0]);
          if (div.firstChild === null) {
              expect.fail();
          } else {
              expect(div.firstChild.textContent).to.equal('foo');
          }
      });
    });

    describe('prop', ()  => {
      it('should add arbitrary properties to the element', () => {
          const div =  renderNode(buildNode('div', (_) => _
              .prop('v1', 'foo')
              .prop('v2', 'bar')
              .prop('v3', 'biz'),
          )[0]);
          expect(div.getAttribute('v1')).to.equal('foo');
          expect(div.getAttribute('v2')).to.equal('bar');
          expect(div.getAttribute('v3')).to.equal('biz');
      });
    });

    describe('on', () => {
      it('should add an event listener for the given event to the element', () => {
          let res = '';
          const div =  renderNode(buildNode('div', (_) => _
              .on(Events.Mouse.Click, () => res += 'hello')
              .on(Events.Mouse.Click, () => res += 'world'),
          )[0]);

          // @ts-ignore
          div.dispatchEvent(new window.Event(Events.Mouse.Click));

          expect(res).to.equal('helloworld');
      });
    });
});
