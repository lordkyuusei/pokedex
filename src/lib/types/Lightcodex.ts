type LightCodexNames = {
    [key: string]: string;
};

export type LightCodex = {
    id: number;
    name: string;
    types: string[];
    names: LightCodexNames;
}