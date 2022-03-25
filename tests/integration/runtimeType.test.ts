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

const Some = {
  number: 42,
  string: 'foo',
  object: {},
  array: [],
  boolean: true,
  function:  () => {},
  regex: / /i,
  circularReferencingObject: { circularRef: {} as object },
};
Some.circularReferencingObject.circularRef = Some.circularReferencingObject;

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
      it('peek', () => {
        const { expectFail, expectSuccess } = prepareRuntimeTypeChecks('peek');
        expectSuccess(Some.function);
        expectFail(Some.number);
        expectFail(Some.string);
        expectFail(Some.object);
        expectFail(Some.boolean);
        expectFail(Some.array);
        expectFail();
      });
      it('id', () => {
        const { expectFail, expectSuccess } = prepareRuntimeTypeChecks('id');
        expectSuccess(Some.string);
        expectFail(Some.number);
        expectFail(Some.function);
        expectFail(Some.object);
        expectFail(Some.boolean);
        expectFail(Some.array);
        expectFail();
      });
      it('value', () => {
        const { expectSuccess } = prepareRuntimeTypeChecks('value');
        expectSuccess(Some.string);
        expectSuccess(Some.number);
        expectSuccess(Some.function);
        expectSuccess(Some.object);
        expectSuccess(Some.boolean);
        expectSuccess(Some.array);
        expectSuccess(Some.circularReferencingObject);
        expectSuccess();
      });
      it('text', () => {
        const { expectFail, expectSuccess } = prepareRuntimeTypeChecks('text');
        expectSuccess(Some.string);
        expectSuccess(Some.number);
        expectSuccess(Some.function);
        expectSuccess(Some.object);
        expectSuccess(Some.boolean);
        expectSuccess(Some.array);
        expectSuccess();
        expectFail(Some.circularReferencingObject);
      });
      it('on', () => {
        const { expectFail, expectSuccess } = prepareRuntimeTypeChecks('on');
        expectSuccess(Some.string, Some.function);
        expectFail(Some.number, Some.function);
        expectFail(Some.object, Some.function);
        expectFail(Some.number, Some.function);
        expectFail(Some.boolean, Some.function);
        expectFail(Some.array, Some.function);
        expectFail(Some.string);
        expectFail(Some.string, Some.number);
        expectFail(Some.string, Some.string);
        expectFail(Some.string, Some.object);
        expectFail(Some.string, Some.boolean);
        expectFail(Some.string, Some.array);
        expectFail();
      });
      it('prop', () => {
        const { expectSuccess, expectFail } = prepareRuntimeTypeChecks('prop');
        expectSuccess(Some.string, Some.string);
        expectSuccess(Some.string, Some.number);
        expectSuccess(Some.string, Some.function);
        expectSuccess(Some.string, Some.object);
        expectSuccess(Some.string, Some.boolean);
        expectSuccess(Some.string, Some.array);
        expectFail(Some.number, Some.string);
        expectFail(Some.object, Some.string);
        expectFail(Some.number, Some.string);
        expectFail(Some.boolean, Some.string);
        expectFail(Some.array, Some.string);
        expectFail(Some.string, Some.circularReferencingObject);
        expectFail();
      });
      it('do', () => {
        const { expectSuccess, expectFail } = prepareRuntimeTypeChecks('do');
        expectSuccess(Some.function);
        expectSuccess(Some.function, Some.function);
        expectSuccess(Some.function, Some.function, Some.function);
        expectSuccess(...Array(100).fill(Some.function));
        expectSuccess();
        expectFail(Some.number);
        expectFail(Some.object);
        expectFail(Some.boolean);
        expectFail(Some.array);
        expectFail(Some.function, Some.number);
        expectFail(Some.function, Some.object);
        expectFail(Some.function, Some.boolean);
        expectFail(Some.function, Some.array);
        expectFail(Some.number, Some.function);
        expectFail(Some.object, Some.function);
        expectFail(Some.boolean, Some.function);
        expectFail(Some.array, Some.function);
      });
      it('style', () => {
        const { expectSuccess, expectFail } = prepareRuntimeTypeChecks('style');
        expectSuccess(Some.object);
        expectFail(Some.circularReferencingObject);
        expectFail(Some.number);
        expectFail(Some.string);
        expectFail(Some.function);
        expectFail(Some.boolean);
        expectFail(Some.array);
        expectFail();
      });
      it('name', () => {
        const { expectSuccess, expectFail } = prepareRuntimeTypeChecks('name');
        expectSuccess(Some.string);
        expectFail(Some.number);
        expectFail(Some.function);
        expectFail(Some.boolean);
        expectFail(Some.object);
        expectFail(Some.array);
        expectFail();
      });
      it('class', () => {
        const {  expectSuccess, expectFail } = prepareRuntimeTypeChecks('class');
        expectSuccess(Some.string);
        expectSuccess(Some.string, Some.string);
        expectSuccess(Some.string, Some.string, Some.string);
        expectSuccess(...Array(100).fill(Some.string));
        expectSuccess();
        expectFail(Some.number);
        expectFail(Some.function);
        expectFail(Some.object);
        expectFail(Some.boolean);
        expectFail(Some.array);
        expectFail(Some.string, Some.number);
        expectFail(Some.number, Some.string);
        expectFail(Some.string, Some.number, Some.string);
      });
      it('when', () => {
        const {  expectSuccess, expectFail } = prepareRuntimeTypeChecks('when');
        expectSuccess(Some.boolean, Some.function);
        expectSuccess(Some.boolean, Some.function, Some.function);
        expectFail(Some.number, Some.function);
        expectFail(Some.string, Some.function);
        expectFail(Some.function, Some.function);
        expectFail(Some.object, Some.function);
        expectFail(Some.array, Some.function);
        expectFail(Some.boolean, Some.boolean);
        expectFail(Some.boolean, Some.string);
        expectFail(Some.boolean, Some.number);
        expectFail(Some.boolean, Some.array);
        expectFail(Some.boolean, Some.object);
        expectFail(Some.boolean, Some.function, Some.boolean);
        expectFail(Some.boolean, Some.function, Some.string);
        expectFail(Some.boolean, Some.function, Some.number);
        expectFail(Some.boolean, Some.function, Some.array);
        expectFail(Some.boolean, Some.function, Some.object);
        expectFail();
      });
      it('while', () => {
        const {  expectSuccess, expectFail } = prepareRuntimeTypeChecks('while');
        expectSuccess(Some.function, Some.function);
        expectFail(Some.function, Some.number);
        expectFail(Some.function, Some.boolean);
        expectFail(Some.function, Some.array);
        expectFail(Some.function, Some.object);
        expectFail(Some.function, Some.string);
        expectFail(Some.number, Some.function);
        expectFail(Some.boolean, Some.function);
        expectFail(Some.array, Some.function);
        expectFail(Some.object, Some.function);
        expectFail(Some.string, Some.function);
        expectFail(Some.function);
        expectFail(Some.number);
        expectFail(Some.boolean);
        expectFail(Some.array);
        expectFail(Some.object);
        expectFail(Some.string);
        expectFail();
      });
      it('child', () => {
        const {  expectSuccess, expectFail } = prepareRuntimeTypeChecks('child');
        expectSuccess(Some.string, Some.function);
        expectFail(Some.string);
        expectFail(Some.function);
        expectFail(Some.number);
        expectFail(Some.boolean);
        expectFail(Some.array);
        expectFail(Some.object);
        expectFail(Some.function, Some.function);
        expectFail(Some.number, Some.function);
        expectFail(Some.boolean, Some.function);
        expectFail(Some.array, Some.function);
        expectFail(Some.object, Some.function);
      });
      it('children', () => {
        const {  expectSuccess, expectFail } = prepareRuntimeTypeChecks('children');
        expectSuccess(Some.string, Some.number, Some.function);
        expectSuccess(Some.string, Some.array, Some.function);
        expectFail(Some.string);
        expectFail(Some.function);
        expectFail(Some.number);
        expectFail(Some.boolean);
        expectFail(Some.array);
        expectFail(Some.object);
        expectFail(Some.string, Some.number);
        expectFail(Some.function, Some.number);
        expectFail(Some.number, Some.number);
        expectFail(Some.boolean, Some.number);
        expectFail(Some.array, Some.number);
        expectFail(Some.object, Some.number);
        expectFail(Some.string, Some.array);
        expectFail(Some.function, Some.array);
        expectFail(Some.number, Some.array);
        expectFail(Some.boolean, Some.array);
        expectFail(Some.array, Some.array);
        expectFail(Some.object, Some.array);
        expectFail(Some.function, Some.number, Some.function);
        expectFail(Some.number, Some.number, Some.function);
        expectFail(Some.boolean, Some.number, Some.function);
        expectFail(Some.array, Some.number, Some.function);
        expectFail(Some.object, Some.number, Some.function);
        expectFail(Some.function, Some.array, Some.function);
        expectFail(Some.number, Some.array, Some.function);
        expectFail(Some.boolean, Some.array, Some.function);
        expectFail(Some.array, Some.array, Some.function);
        expectFail(Some.object, Some.array, Some.function);
      });
    });
  });
});
