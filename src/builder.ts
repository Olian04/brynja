import { NodeDTO } from './node';

// Events: https://www.w3schools.com/tags/ref_eventattributes.asp
export namespace Events {
    export enum Mouse {
        Click = 'click',
        DoubleClick = 'dblclick',
        Down = 'mousedown',
        Up = 'mouseup',
        Move = 'mousemove',
        Out = 'mouseout',
        Over = 'mouseover',
        Wheel = 'wheel'
    }
    export enum Keyboard {
        Down = 'keydown',
        Up = 'keyup',
        Press = 'keypress'
    }
    export enum Drag {
        Drag = 'drag',
        End = 'dragend',
        Enter = 'dragenter',
        Leave = 'dragleave',
        Over = 'dragover',
        Start = 'dragstart',
        Drop = 'drop',
        Scroll = 'scroll'
    }
    export enum Clipboard {
        Copy = 'copy',
        Cut = 'cut',
        Paste = 'paste'
    }
}

export type BuilderCB = (ctx: BuilderCTX) => void;
export interface BuilderCTX {
    child(tagType: string, builder: BuilderCB): BuilderCTX;
    children(tagType: string, count: number, builder: (ctx: BuilderCTX, i: number) => void): BuilderCTX;
    when(predicate: () => boolean, then_builder: BuilderCB, else_builder?: BuilderCB): BuilderCTX;
    while(predicate: (i: number) => boolean, builder: (ctx: BuilderCTX, i: number) => void): BuilderCTX;
    do(builder: BuilderCB): BuilderCTX;
    value(value: any): BuilderCTX;
    prop(key: string, value: string): BuilderCTX;
    id(value: string): BuilderCTX;
    class(valuesArr: string[]): BuilderCTX;
    name(value: string): BuilderCTX;
    text(value: string): BuilderCTX;
    peek(callback: (ctx: NodeDTO) => void): BuilderCTX;
    on(eventName: Events.Mouse.Wheel, handler: (event: WheelEvent) => void): BuilderCTX;
    on(eventName: Events.Mouse, handler: (event: MouseEvent) => void): BuilderCTX;
    on(eventName: Events.Keyboard, handler: (event: KeyboardEvent) => void): BuilderCTX;
    on(eventName: Events.Drag, handler: (event: DragEvent) => void): BuilderCTX;
    on(eventName: Events.Clipboard, handler: (event: ClipboardEvent) => void): BuilderCTX;
    on(eventName: string, handler: (event: any) => void): BuilderCTX;
}

export function buildNode(tagType: string | null, builder: BuilderCB): NodeDTO {
    const ctx: NodeDTO = {
        tag: tagType,
        value: null,
        text: '',
        events: {},
        props: {},
        children: []
    };
    builder({
        on(eventName: string, handler: (e: any) => void) {
            if (eventName in ctx.events) {
                ctx.events[eventName].push(handler);
            } else {
                ctx.events[eventName] = [handler];
            }
            return this;
        },
        child(tagType: string, builder: BuilderCB) {
            ctx.children.push(buildNode(tagType, builder));
            return this;
        },
        children(tagType: string, count: number, builder: (ctx: BuilderCTX, i: number) => void) {
            for (let i = 0; i < count; i++) {
                ctx.children.push(buildNode(tagType, _ => builder(_, i)));
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
        do(builder: BuilderCB) {
            builder(this);
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
            callback( {...ctx} );
            return this;
        }
    });
    return ctx;
}