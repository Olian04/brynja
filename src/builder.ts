import { IBuilderCTX } from './interfaces/BuilderCTX';
import { IStyleObject } from './interfaces/StyleObject';
import { IStyles } from './interfaces/Styles';
import { VNode } from './interfaces/VNode';
import { objHash } from './util/hash';

export const newVNode = (ctx: Partial<VNode> = {}) => ({
  tag: '',
  value: null,
  text: '',
  events: {},
  props: {},
  children: [],
  ...ctx, // Replace defaults in present in ctx argument
});

const naiveTypeCheck = <T>(
  operationName: string,
  argumentPosition: string,
  expectedType: string,
  argumentValue: T,
) => {
  if (typeof argumentValue !== expectedType) {
    /* istanbul ignore next */
    throw new TypeError(
      `Brynja: Expected ${argumentPosition} argument of "${operationName}" operation to be of type ${expectedType}, but received ${typeof argumentValue}`,
    );
  }
};

export type BuilderCB = (ctx: IBuilderCTX) => void;
export function buildNode(
  tagType: string,
  builder: BuilderCB,
): [VNode, IStyles] {
  const ctx: VNode = newVNode({
    tag: tagType,
  });

  let styles: IStyles = {};
  const builderCtx: IBuilderCTX = {
    style(styleObject: IStyleObject) {
      naiveTypeCheck('style', 'first', 'object', styleObject);

      const styleHash = objHash(styleObject);
      styles[styleHash] = styleObject;
      this.class(styleHash);
      return this;
    },
    on(eventName: string, handler: (e: any) => void) {
      naiveTypeCheck('on', 'first', 'string', eventName);
      naiveTypeCheck('on', 'second', 'function', handler);

      if (eventName in ctx.events) {
        ctx.events[eventName].push(handler);
      } else {
        ctx.events[eventName] = [handler];
      }
      return this;
    },
    child(tagType: string, builder: BuilderCB) {
      naiveTypeCheck('child', 'first', 'string', tagType);
      naiveTypeCheck('child', 'second', 'function', builder);

      const [child, childStyles] = buildNode(tagType, builder);
      ctx.children.push(child);
      styles = { ...styles, ...childStyles };
      return this;
    },
    children<T>(
      tagType: string,
      countOrArray: number | T[],
      builder: (ctx: IBuilderCTX, i: number | T) => void,
    ) {
      naiveTypeCheck('child', 'first', 'string', tagType);
      if (typeof countOrArray !== 'number' && !Array.isArray(countOrArray)) {
        /* istanbul ignore next */
        throw new TypeError(
          `Brynja: Expected second argument of "child" operation to be of type number or array, but received ${typeof countOrArray}`,
        );
      }
      naiveTypeCheck('child', 'third', 'function', builder);

      const items =
        typeof countOrArray === 'number'
          ? Array(countOrArray)
              .fill(0)
              .map((_, i) => i)
          : (countOrArray as T[]);
      const count = items.length;

      for (let __i = 0; __i < count; __i++) {
        const [child, childStyles] = buildNode(tagType, (_) =>
          builder(_, items[__i]),
        );
        ctx.children.push(child);
        styles = { ...styles, ...childStyles };
      }
      return this;
    },
    when(
      booleanExpression: boolean,
      then_builder: BuilderCB,
      else_builder?: BuilderCB,
    ) {
      naiveTypeCheck('when', 'first', 'boolean', booleanExpression);
      naiveTypeCheck('when', 'second', 'function', then_builder);
      if (else_builder) {
        naiveTypeCheck('when', 'third', 'function', else_builder);
      }

      if (booleanExpression) {
        then_builder(this);
      } else if (else_builder) {
        else_builder(this);
      }
      return this;
    },
    while(
      predicate: (i: number) => boolean,
      builder: (ctx: IBuilderCTX, i: number) => void,
    ) {
      naiveTypeCheck('while', 'first', 'function', predicate);
      naiveTypeCheck('while', 'second', 'function', builder);

      for (let i = 0; predicate(i); i++) {
        builder(this, i);
      }
      return this;
    },
    do(...builders: BuilderCB[]) {
      builders.forEach((builder) => {
        if (typeof builder !== 'function') {
          /* istanbul ignore next */
          throw new TypeError(
            `Brynja: Expected all arguments of "do" operation to be functions, but received ${typeof builder}`,
          );
        }

        builder(this);
      });
      return this;
    },
    value(value: any) {
      ctx.value = value;
      return this;
    },
    text(value: string) {
      naiveTypeCheck('text', 'first', 'string', value);

      ctx.text = value;
      return this;
    },
    prop(key: string, value: string) {
      naiveTypeCheck('text', 'first', 'string', key);
      naiveTypeCheck('text', 'second', 'string', value);

      ctx.props[key] = value;
      return this;
    },
    id(value: string) {
      naiveTypeCheck('text', 'first', 'string', value);
      ctx.props.id = value;
      return this;
    },
    class(...valuesArr: string[]) {
      valuesArr.forEach((className) => {
        if (typeof className !== 'string') {
          /* istanbul ignore next */
          throw new TypeError(
            `Brynja: Expected all arguments of "class" operation to be strings, but received ${typeof className}`,
          );
        }
      });

      if (!('class' in ctx.props)) {
        ctx.props.class = valuesArr.join(' ');
      } else {
        ctx.props.class = [...ctx.props.class.split(' '), ...valuesArr].join(
          ' ',
        );
      }
      return this;
    },
    name(value: string) {
      naiveTypeCheck('name', 'first', 'string', value);

      ctx.props.name = value;
      return this;
    },
    peek(callback) {
      naiveTypeCheck('peek', 'first', 'function', callback);

      function ctxProxy(ctx: VNode): VNode {
        return {
          tag: ctx.tag,
          text: ctx.text,
          value: ctx.value,
          props: ctx.props,
          events: ctx.events,
          children: new Proxy([], {
            get: (__, key: any) => {
              if (key === 'length') {
                return ctx.children.length;
              } else if (!isNaN(parseFloat(key.toString()))) {
                return ctxProxy(ctx.children[key as number]);
              } else {
                /* istanbul ignore next */
                throw new Error('Brynja: Illegal operation');
              }
            },
          }),
        };
      }
      callback(ctxProxy(ctx));
      return this;
    },
  };
  builder(builderCtx);
  return [ctx, styles];
}
