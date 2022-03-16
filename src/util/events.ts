// Events: https://www.w3schools.com/tags/ref_eventattributes.asp

// tslint:disable-next-line no-namespace
export namespace Events {
  export enum Mouse {
    Click = 'click',
    DoubleClick = 'dblclick',
    Down = 'mousedown',
    Up = 'mouseup',
    Move = 'mousemove',
    Out = 'mouseout',
    Over = 'mouseover',
    Wheel = 'wheel',
  }
  export enum Keyboard {
    Down = 'keydown',
    Up = 'keyup',
    Press = 'keypress',
  }
  export enum Drag {
    Drag = 'drag',
    End = 'dragend',
    Enter = 'dragenter',
    Leave = 'dragleave',
    Over = 'dragover',
    Start = 'dragstart',
    Drop = 'drop',
    Scroll = 'scroll',
  }
  export enum Clipboard {
    Copy = 'copy',
    Cut = 'cut',
    Paste = 'paste',
  }
}
