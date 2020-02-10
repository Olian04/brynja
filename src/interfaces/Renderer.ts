import { BuilderCB } from '../builder';
export interface IRenderer {
    render(rootBuilder: BuilderCB): void;
}
