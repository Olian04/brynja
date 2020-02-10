import { BuilderCB } from '../builder';
import { Events } from '../util/events';
import { IStyleObject } from './StyleObject';
import { VNode } from './VNode';

export interface IBuilderCTX {
    child(tagType: string, builder: BuilderCB): this;
    children(tagType: string, count: number, builder: (ctx: this, i: number) => void): this;
    children<T>(tagType: string, items: T[], builder: (ctx: this, item: T) => void): this;
    when(booleanExpression: boolean, then_builder: BuilderCB, else_builder?: BuilderCB): this;
    while(predicate: (i: number) => boolean, builder: (ctx: this, i: number) => void): this;
    do(...builders: BuilderCB[]): this;
    value(value: any): this;
    prop(key: string, value: string): this;
    id(value: string): this;
    class(...valuesArr: string[]): this;
    name(value: string): this;
    text(value: string): this;
    peek(callback: (ctx: VNode) => void): this;
    on(eventName: Events.Mouse.Wheel, handler: (event: WheelEvent) => void): this;
    on(eventName: Events.Mouse, handler: (event: MouseEvent) => void): this;
    on(eventName: Events.Keyboard, handler: (event: KeyboardEvent) => void): this;
    on(eventName: Events.Drag, handler: (event: DragEvent) => void): this;
    on(eventName: Events.Clipboard, handler: (event: ClipboardEvent) => void): this;
    on(eventName: string, handler: (event: any) => void): this;
    style(styleObject: IStyleObject): this;
}
