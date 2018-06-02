export interface NodeDTO {
    tag: string;
    value: string | number | null;
    events: { [key: string]: ((event: object) => void)[] };
    props: { [key: string]: string };
    children: NodeDTO[];
}