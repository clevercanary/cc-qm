export interface Filters {
    EQUALS: "EQUALS";
    IN: "IN";
    NOT: "NOT";
    GT: "GT";
    LT: "LT";
    SIZE: "SIZE";
    MATCH: "MATCH";
    REGEXP: "REGEXP";
    EXISTS: "EXISTS";
}
export declare const FILTER_TYPES: Filters;
export declare type FilterOperator = keyof Filters;
export declare class QueryFilter {
    filterType: FilterOperator;
    fieldName: string;
    value: any;
    options?: any;
}
