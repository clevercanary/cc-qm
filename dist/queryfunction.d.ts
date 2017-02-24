export interface FunctionNames {
    COUNT: "COUNT";
    DISTINCT: "DISTINCT";
}
export declare const FUNCTION_NAMES: FunctionNames;
export declare type FunctionType = keyof FunctionNames;
export declare class QueryFunction {
    name: FunctionType;
}
