import { expect } from 'chai';
import jsdom from 'mocha-jsdom';

import { renderStyle } from './renderStyles';

describe('renderStyle', () => {
  jsdom();

  it('typecheck', () => {
    expect(typeof renderStyle).to.equal('function');
  });

  it('single property applied once', () => {
    const inputStyle = {
      'some-class': {
        background: 'orangered',
      },
    };

    const styles = renderStyle(inputStyle).replace(/\s/g, '');
    expect(styles).to.equal('.some-class{background:orangered;}');
  });

  it('camel cased property transformed to kebab case', () => {
    const inputStyle = {
      'some-class': {
        borderTopColor: 'orangered',
      },
    };

    const styles = renderStyle(inputStyle).replace(/\s/g, '');
    expect(styles).to.equal('.some-class{border-top-color:orangered;}');
  });

  it('single pseudo selector applied once', () => {
    const inputStyle = {
      'some-class': {
        ':hover': {
          background: 'orangered',
        },
      },
    };

    const styles = renderStyle(inputStyle).replace(/\s/g, '');
    expect(styles).to.equal('.some-class:hover{background:orangered;}');
  });
});
