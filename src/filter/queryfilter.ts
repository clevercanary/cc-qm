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
export const FILTER_TYPES: Filters = {
    EQUALS: "EQUALS",
    IN: "IN",
    NOT: "NOT",
    GT: "GT",
    LT: "LT",
    SIZE: "SIZE",
    MATCH: "MATCH",
    REGEXP: "REGEXP",
    EXISTS: "EXISTS"
};

export type FilterOperator = keyof Filters;

export class QueryFilter {

    public filterType: FilterOperator;
    public fieldName: string;
    public value: any;
    public options?: any;
}
