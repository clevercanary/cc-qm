export interface FunctionNames {
    COUNT: "COUNT";
    DISTINCT: "DISTINCT";
}

export const FUNCTION_NAMES: FunctionNames = {
    COUNT: "COUNT",
    DISTINCT: "DISTINCT"
};

export type FunctionType = keyof FunctionNames;

export class QueryFunction {
    name: FunctionType
}
