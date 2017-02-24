import { QueryFilter } from "./queryfilter";
export interface ConditionalFilters {
    OR: "OR";
    AND: "AND";
}
export declare type ConditionalFilterOperator = keyof ConditionalFilters;
export declare const CONDITIONAL_FILTER_TYPES: ConditionalFilters;
export declare class ConditionalQueryFilter {
    filterType: ConditionalFilterOperator;
    conditions: QueryFilter[];
    static isConditional(filter: QueryFilter | ConditionalQueryFilter): filter is ConditionalQueryFilter;
}
