import { VNode } from './util/vnode';
import { Events } from './util/events';

export type CustomOperation = (...args) => (_: BuilderCTX) => BuilderCTX;
export interface CustomOperations {
    [operationName: string]: CustomOperation;
}

export type BuilderCB = (ctx: BuilderCTX) => void;
export interface BuilderCTX {
    child(tagType: string, builder: BuilderCB): BuilderCTX;
    children(tagType: string, count: number, builder: (ctx: BuilderCTX, i: number) => void): BuilderCTX;
    when(predicate: () => boolean, then_builder: BuilderCB, else_builder?: BuilderCB): BuilderCTX;
    while(predicate: (i: number) => boolean, builder: (ctx: BuilderCTX, i: number) => void): BuilderCTX;
    do(...builders: BuilderCB[]): BuilderCTX;
    value(value: any): BuilderCTX;
    prop(key: string, value: string): BuilderCTX;
    id(value: string): BuilderCTX;
    class(valuesArr: string[]): BuilderCTX;
    name(value: string): BuilderCTX;
    text(value: string): BuilderCTX;
    peek(callback: (ctx: VNode) => void): BuilderCTX;
    on(eventName: Events.Mouse.Wheel, handler: (event: WheelEvent) => void): BuilderCTX;
    on(eventName: Events.Mouse, handler: (event: MouseEvent) => void): BuilderCTX;
    on(eventName: Events.Keyboard, handler: (event: KeyboardEvent) => void): BuilderCTX;
    on(eventName: Events.Drag, handler: (event: DragEvent) => void): BuilderCTX;
    on(eventName: Events.Clipboard, handler: (event: ClipboardEvent) => void): BuilderCTX;
    on(eventName: string, handler: (event: any) => void): BuilderCTX;
    [operationName: string]:  (...args) => BuilderCTX; // Needed for integration with customOperations
} 

export function buildNode(tagType: string, builder: BuilderCB, customOperations: CustomOperations): VNode {
    const ctx: VNode = {
        tag: tagType,
        value: null,
        text: '',
        events: {},
        props: {},
        children: []
    };
    const builderCtx: BuilderCTX = {
        on(eventName: string, handler: (e: any) => void) {
            if (eventName in ctx.events) {
                ctx.events[eventName].push(handler);
            } else {
                ctx.events[eventName] = [handler];
            }
            return this;
        },
        child(tagType: string, builder: BuilderCB) {
            ctx.children.push(buildNode(tagType, builder, customOperations));
            return this;
        },
        children(tagType: string, count: number, builder: (ctx: BuilderCTX, i: number) => void) {
            for (let i = 0; i < count; i++) {
                ctx.children.push(buildNode(tagType, _ => builder(_, i), customOperations));
            }
            return this;
        },
        when(predicate: () => boolean, then_builder, else_builder = undefined) {
            if (predicate()) {
                then_builder(this);
            } else if (else_builder) {
                else_builder(this);
            }
            return this;
        },
        while(predicate: (i: number) => boolean, builder: (ctx: BuilderCTX, i: number) => void) {
            for (let i = 0; predicate(i); i++) {
                builder(this, i);
            }
            return this;
        },
        do(...builders: BuilderCB[]) {
            builders.forEach(builder => builder(this));
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
            ctx.props['id'] = value;
            return this;
        },
        class(valuesArr: string[]) {
            if (!('class' in ctx.props)) {
                ctx.props['class'] = valuesArr.join(' ');
            } else {
                ctx.props['class'] = [...ctx.props['class'].split(' '), ...valuesArr].join(' ');
            }
            return this;
        },
        name(value: string) {
            ctx.props['name'] = value;
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
                        }
                    })
                }
            }
            callback( ctxProxy(ctx) );
            return this;
        },
        ...Object.keys(customOperations).reduce((res, k) => ({...res,
            [k]:  (...args) => {
                customOperations[k](...args)(builderCtx);
                return builderCtx;
            }
        }), {})
    };
    builder(builderCtx);
    return ctx;
}