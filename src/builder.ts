import { IBuilderCTX } from './interfaces/BuilderCTX';
import { IStyleObject } from './interfaces/StyleObject';
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

export type BuilderCB = (ctx: IBuilderCTX) => void;
interface Styles { [key: string]: IStyleObject; }
export function buildNode(
    tagType: string,
    builder: BuilderCB,
): [VNode, Styles] {
    const ctx: VNode = newVNode({
        tag: tagType,
    });

    let styles: Styles = {};
    const builderCtx: IBuilderCTX = {
        style(styleObject: IStyleObject) {
            const styleHash = objHash(styleObject);
            styles[styleHash] = styleObject;
            this.class([ styleHash ]);
            return this;
        },
        on(eventName: string, handler: (e: any) => void) {
            if (eventName in ctx.events) {
                ctx.events[eventName].push(handler);
            } else {
                ctx.events[eventName] = [handler];
            }
            return this;
        },
        child(tagType: string, builder: BuilderCB) {
            const [child, childStyles] = buildNode(tagType, builder);
            ctx.children.push(child);
            styles = {...styles, ...childStyles};
            return this;
        },
        children<T>(tagType: string, countOrArray: number | T[], builder: (ctx: IBuilderCTX, i: number | T) => void) {
            const items = typeof countOrArray === 'number'
                ? Array(countOrArray).fill(0).map((_, i) => i)
                : countOrArray as T[];
            const count = items.length;

            for (let __i = 0; __i < count; __i++) {
                const [child, childStyles] = buildNode(tagType, (_) => builder(_, items[__i]));
                ctx.children.push(child);
                styles = {...styles, ...childStyles};
            }
            return this;
        },
        when(booleanExpression, then_builder, else_builder?) {
            if (booleanExpression) {
                then_builder(this);
            } else if (else_builder) {
                else_builder(this);
            }
            return this;
        },
        while(predicate: (i: number) => boolean, builder: (ctx: IBuilderCTX, i: number) => void) {
            for (let i = 0; predicate(i); i++) {
                builder(this, i);
            }
            return this;
        },
        do(...builders: BuilderCB[]) {
            builders.forEach((builder) => builder(this));
            return this;
        },
        value(value: any) {
            ctx.value = value;
            return this;
        },
        text(value: string) {
            ctx.text = value;
            return this;
        },
        prop(key: string, value: string) {
            ctx.props[key] = value;
            return this;
        },
        id(value: string) {
            ctx.props.id = value;
            return this;
        },
        class(valuesArr: string[]) {
            if (!('class' in ctx.props)) {
                ctx.props.class = valuesArr.join(' ');
            } else {
                ctx.props.class = [...ctx.props.class.split(' '), ...valuesArr].join(' ');
            }
            return this;
        },
        name(value: string) {
            ctx.props.name = value;
            return this;
        },
        peek(callback) {
            function ctxProxy(ctx: VNode) {
                return {
                    tag: ctx.tag,
                    text: ctx.text,
                    value: ctx.value,
                    props: ctx.props,
                    events: ctx.events,
                    children: new Proxy([], {
                        get: (arr, key) => {
                            if (key === 'length') {
                                return ctx.children.length;
                            } else if (!isNaN(parseFloat(key.toString()))) {
                                return ctxProxy(ctx.children[key]);
                            } else {
                                return arr[key];
                            }
                        },
                    }),
                };
            }
            callback( ctxProxy(ctx) );
            return this;
        },
    };
    builder(builderCtx);
    return [ctx, styles];
}
