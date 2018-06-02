export interface INode {
    tag: string;
    value: any;
    events: { [key: string]: ((event: object) => void)[] };
    props: { [key: string]: string };
    children: INode[];
}

export type BuilderCB = (ctx: BuilderCTX) => void;
export interface BuilderCTX {
    child(tagType: string, builder: BuilderCB): BuilderCTX;
    children(tagName: string, count: number, builder: BuilderCB): BuilderCTX;
    when(predicat: () => boolean, then_builder: BuilderCB, else_builder?: BuilderCB): BuilderCTX;
    on(eventName: string, handler: (event: object) => void): BuilderCTX;
    value(value: any): BuilderCTX;
    prop(key: string, value: string): BuilderCTX;
    id(value: string): BuilderCTX;
    class(valuesArr: string[]): BuilderCTX;
    name(value: string): BuilderCTX;
}

export function buildNode(tagType: string, builder: BuilderCB) {
    const ctx: INode = {
        tag: tagType,
        value: null,
        events: {},
        props: {},
        children: []
    };
    builder({
        child(tagType: string, builder: BuilderCB) {
            ctx.children.push(buildNode(tagType, builder));
            return this;
        },
        children(tagName, count, builder) {
            for (let i = 0; i < count; i++) {
                ctx.children.push(buildNode(tagType, builder));
            }
            return this;
        },
        when(predicat: () => boolean, then_builder, else_builder = undefined) {
            if (predicat()) {
                then_builder(this);
            } else if (else_builder) {
                else_builder(this);
            }
            return this;
        },
        on(eventName: string, handler: (event: object) => void) {
            if (eventName in ctx.events) {
                ctx.events[eventName].push(handler);
            } else {
                ctx.events[eventName] = [handler];
            }
            return this;
        },
        value(value: any) {
            ctx.value = value;
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
                ctx.props['class'] = '';
            }
            ctx.props['class'] = [...ctx.props['class'].split(' '), ...valuesArr].join(' ');
            return this;
        },
        name(value: string) {
            ctx.props['name'] = value;
            return this;
        }
    });
    return ctx;
}