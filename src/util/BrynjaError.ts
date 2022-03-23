export class BrynjaError extends Error {
  constructor(msg: string) {
    super(`Brynja: ${msg}`);
  }
}
