export class BrynjaTypeError extends TypeError {
  constructor(msg: string) {
    super(`Brynja: ${msg}`);
  }
}
