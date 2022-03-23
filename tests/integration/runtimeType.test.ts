import { describe, it } from 'mocha';
import { AssertionError, expect } from 'chai';

// tslint:disable-next-line:no-var-requires
const jsdom: () => void = require('mocha-jsdom');

import { BrynjaError } from '../../src/util/BrynjaError';
import { defaultRendererFactory } from '../../src/defaultRenderer';
import { IBuilderCTX } from '../../src/interfaces/BuilderCTX';
import { BrynjaTypeError } from '../../src/util/BrynjaTypeError';

const prepareRuntimeTypeChecks = (operation: keyof IBuilderCTX) => {
  const { render } = defaultRendererFactory()();
  return {
    expectFail: (...args: any[]) => {
      try {
        render(_=>
          // @ts-ignore
          _[operation](...args),
        );
        expect.fail(`Arguments of type "${args.map(a => typeof a).join(' ')}" should fail`);
      } catch (e) {
        if (e instanceof AssertionError) {
          // Pass through assertion error
          throw e;
        }
        expect(e).to.be.instanceof(BrynjaTypeError);
      }
    },
    expectSuccess: (...args: any[]) => {
      try {
        render(_=>
          // @ts-ignore
          _[operation](...args),
        );
      } catch (e) {
        if (e instanceof AssertionError) {
          // Pass through assertion error
          throw e;
        }
        expect.fail(`Arguments of type "${args.map(a => typeof a).join(' ')}" should fail`);
      }
    }
  }
}

describe('Integrations test', () => {
  jsdom();

  beforeEach(() => {
    document.body.innerHTML = '<div id="root"></div>';
  });

  describe('Runtime type exceptions', ()  => {
    describe('Default renderer', () => {
      it('should throw an error if no element with id "root" exists', () => {
        document.body.innerHTML = '';
        const defaultRenderer = defaultRendererFactory();
        try {
          defaultRenderer().render(_=>_)
          expect.fail();
        } catch (e) {
          if (e instanceof AssertionError) {
            // Pass through assertion error
            throw e;
          }
          expect(e).to.be.instanceof(BrynjaError);
        }
      });
    });

    describe('Operations', () => {
      it('id', () => {
        const { expectFail, expectSuccess } = prepareRuntimeTypeChecks('id');
        expectSuccess('someString');
        expectFail(42);
        expectFail(() => {});
        expectFail({});
        expectFail(true);
        expectFail([]);
      });
      it('value', () => {
        const { expectSuccess } = prepareRuntimeTypeChecks('value');
        expectSuccess('someString');
        expectSuccess(42);
        expectSuccess(() => {});
        expectSuccess({});
        expectSuccess(true);
        expectSuccess([]);
      });
      it('text', () => {
        const { expectFail, expectSuccess } = prepareRuntimeTypeChecks('text');
        expectSuccess('someString');
        expectSuccess(42);
        expectSuccess(() => {});
        expectSuccess({});
        expectSuccess(true);
        expectSuccess([]);

        const a = { circularRef: {} as object };
        a.circularRef = a;
        expectFail(a);
      });
      it('on', () => {
        const { expectFail } = prepareRuntimeTypeChecks('on');
        expectFail('someEvent', 42);
        expectFail('someEvent', 'foo');
        expectFail('someEvent', {});
        expectFail('someEvent', true);
        expectFail('someEvent', []);
      });
      it('prop', () => {
        const { expectFail } = prepareRuntimeTypeChecks('prop');
        // TODO: Add expectSuccess tests
        const a = { circularRef: {} as object };
        a.circularRef = a;
        expectFail('prop', 'someProp', a);
      });
      it('do', () => {
        const { expectFail } = prepareRuntimeTypeChecks('do');
        // TODO: Add expectSuccess tests
        expectFail(42);
        expectFail({});
        expectFail(true);
        expectFail([]);
        expectFail(() => {}, 42);
        expectFail(() => {}, {});
        expectFail(() => {}, true);
        expectFail(() => {}, []);
        expectFail(42, () => {},);
        expectFail({}, () => {},);
        expectFail(true, () => {},);
        expectFail([], () => {},);
      });
      it('style', () => {
        const { expectFail } = prepareRuntimeTypeChecks('style');
        // TODO: Add expectSuccess tests
        expectFail(42);
        expectFail('foo');
        expectFail(() => {});
        expectFail(true);
        expectFail([]);
      });
      it('name', () => {
        const { expectFail } = prepareRuntimeTypeChecks('name');
        // TODO: Add expectSuccess tests
        expectFail(42);
        expectFail('foo');
        expectFail(() => {});
        expectFail(true);
        expectFail([]);
      });
      it('when', () => {
        const { expectFail } = prepareRuntimeTypeChecks('when');
        // TODO: Add expectSuccess tests
        expectFail(42, () => {});
        expectFail('', () => {});
        expectFail(() => {}, () => {});
        expectFail({}, () => {});
        expectFail([], () => {});
        expectFail(true, true);
        expectFail(true, 'foo');
        expectFail(true, 42);
        expectFail(true, []);
        expectFail(true, {});
        expectFail(true, () => {}, true);
        expectFail(true, () => {}, 'foo');
        expectFail(true, () => {}, 42);
        expectFail(true, () => {}, []);
        expectFail(true, () => {}, {});
      });
      it('class', () => {
        const { expectFail } = prepareRuntimeTypeChecks('class');
        // TODO: Add expectSuccess tests
        expectFail(42);
        expectFail(() => {});
        expectFail({});
        expectFail(true);
        expectFail([]);
        expectFail('', 42);
        expectFail(42, '');
        expectFail('', 42, '');
      });
    });
  });
});
