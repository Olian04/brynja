export interface VNode {
  tag: string;
  value: string | number | null;
  text: string;
  events: { [key: string]: ((event: object) => void)[] };
  props: { [key: string]: string };
  children: this[];
}
