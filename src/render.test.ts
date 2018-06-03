import { expect } from 'chai';
import jsdom from 'mocha-jsdom';

import { renderNode } from './render';
import { buildNode } from './builder';

describe('render', () => {
    jsdom();

    it('typecheck', () => {
        expect(typeof renderNode).to.equal('function');
        const div =  renderNode({ 
            tag: 'div', text: '', value: null, events: {}, props: {}, children: [] 
        });
        expect(typeof div).to.equal('object');
    });

    describe('Root init', () => {
        it('Provided root elem', () => {
            const div =  renderNode(
                { tag: null, text: '', value: null, events: {}, props: {}, children: [] },
                document.createElement('div')
            );
            expect(div.tagName).to.equal('DIV');
        });
    
        it('Generated root elem', () => {
            const div =  renderNode({ 
                tag: 'div', text: '', value: null, events: {}, props: {}, children: [] 
            });
            expect(div.tagName).to.equal('DIV');
        });
    });

    describe('Mutations', () => {
        it('id', () => {
            const div =  renderNode(buildNode('div', _=>_
                .id('foo')
            ));
            expect(div.id).to.equal('foo');
        });

        it('class', () => {
            const div =  renderNode(buildNode('div', _=>_
                .class(['foo', 'bar'])
            ));
            expect(div.className).to.equal('foo bar');
        });
        
        it('value', () => {
            const button =  renderNode(buildNode('button', _=>_
                .value('foo')
            ));
            expect(button['value']).to.equal('foo');

            const div =  renderNode(buildNode('div', _=>_
                .value('foo')
            ));
            expect(div['value']).to.equal('foo');
        });

        it('name', () => {
            const div =  renderNode(buildNode('div', _=>_
                .name('foo')
            ));
            expect(div.getAttribute('name')).to.equal('foo');
        });

        it('text', () => {
            const div =  renderNode(buildNode('div', _=>_
                .text('foo')
            ));
            expect(div.innerText).to.equal('foo');
        });

        it('prop', () => {
            const div =  renderNode(buildNode('div', _=>_
                .prop('v1', 'foo')
                .prop('v2', 'bar')
                .prop('v3', 'biz')
            ));
            expect(div.getAttribute('v1')).to.equal('foo');
            expect(div.getAttribute('v2')).to.equal('bar');
            expect(div.getAttribute('v3')).to.equal('biz');
        });

        it('on', () => {
            let res = '';
            const div =  renderNode(buildNode('div', _=>_
                .on('click', () => res += 'hello')
                .on('click', () => res += 'world')
            ));
            div.dispatchEvent(new Event('click'));
            expect(res).to.equal('helloworld');
        });
    });
});