import { describe, it } from 'mocha';
import { expect } from 'chai';

import { renderStyle } from '../../src/renderStyles';

describe('Render styles', () => {
  it('should compute a correct style string for a single property applied once', () => {
    const inputStyle = {
      'some-class': {
        background: 'orangered',
      },
    };

    const styles = renderStyle(inputStyle).replace(/\s/g, '');
    expect(styles).to.equal('.some-class{background:orangered;}');
  });

  it('should transform camel cased properties to kebab case', () => {
    const inputStyle = {
      'some-class': {
        borderTopColor: 'orangered',
      },
    };

    const styles = renderStyle(inputStyle).replace(/\s/g, '');
    expect(styles).to.equal('.some-class{border-top-color:orangered;}');
  });

  it('should compute a correct style string for a single pseudo selector applied once', () => {
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
