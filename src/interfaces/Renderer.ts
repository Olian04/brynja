import { BuilderCB } from '../builder';
export interface IRenderer {
    /**
     * Accepts a builder that defines how the dom should look after the next render.
     * @param {BuilderCB} rootBuilder The builder function for the root element.
     */
    render(rootBuilder: BuilderCB): void;
}
