import { QueryFilter } from "./queryfilter";

export interface ConditionalFilters {
    OR: "OR",
    AND: "AND"
}
export type ConditionalFilterOperator = keyof ConditionalFilters;

export const CONDITIONAL_FILTER_TYPES: ConditionalFilters = {
    OR: "OR",
    AND: "AND"
};

export class ConditionalQueryFilter {

    public filterType: ConditionalFilterOperator;
    public conditions: QueryFilter[];

    static isConditional(filter: QueryFilter | ConditionalQueryFilter): filter is ConditionalQueryFilter {
        return Array.isArray((<ConditionalQueryFilter>filter).conditions);
    }
}
