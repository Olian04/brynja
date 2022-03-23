import { IRenderer } from './interfaces/Renderer';
import { Renderer } from './renderer';
import { BrynjaError } from './util/BrynjaError';

export const defaultRendererFactory = () => {
  let default_renderer: IRenderer | null = null;
  return () => {
      if (default_renderer === null) {
          // This makes sure the dom is ready when the Renderer is constructed.
          const rootElement = document.getElementById('root');
          if (rootElement === null) {
              throw new BrynjaError('Unable to locate element with id "root"');
          }
          default_renderer = Renderer({
              rootElement,
          });
      }
      return default_renderer;
  };
};
