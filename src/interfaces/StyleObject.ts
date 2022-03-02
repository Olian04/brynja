import { Properties, SimplePseudos } from 'csstype';

type properties = Properties<string | number>;
type pseudoSelectors = { [P in SimplePseudos]?: properties };
export interface IStyleObject extends properties, pseudoSelectors {
  [k: string]: any;
}
