import { Properties, SimplePseudos } from 'csstype';

type properties = Properties<string | number>;
type pseudoSelectors = { [P in SimplePseudos]?: properties; };
export interface StyleObject extends properties, pseudoSelectors {
}
