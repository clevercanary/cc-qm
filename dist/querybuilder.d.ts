/// <reference types="mongoose" />
/**
 * CC Query Builder
 */
import { Query } from "mongoose";
import { QueryModel } from "./QueryModel";
import { ConditionalQueryFilter } from "./filter/conditional-queryfilter";
import { QueryFilter } from "./filter/queryfilter";
import { Sort } from "./sort";
import { Populate } from "./populate";
import { Paging } from "./paging";
export declare const queryBuilder: {
    buildQuery: (query: Query<any>, qm: QueryModel, listConfig?: any) => void;
    addFilters: (query: Query<any>, filters: (QueryFilter | ConditionalQueryFilter)[]) => void;
    addSortOrder: (query: Query<any>, sorts: Sort[]) => void;
    addPopulates: (query: Query<any>, populates: Populate[]) => void;
    addPaging: (query: Query<any>, paging: Paging) => void;
    addFunction: (query: Query<any>, qm: QueryModel, listConfig: any) => void;
    addSelects: (query: Query<any>, selects: string) => void;
};
