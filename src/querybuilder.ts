/**
 * CC Query Builder
 */
import { Query } from "mongoose";
import { QueryModel } from "./QueryModel";
import { ConditionalQueryFilter, CONDITIONAL_FILTER_TYPES } from "./filter/conditional-queryfilter";
import { QueryFilter, FILTER_TYPES } from "./filter/queryfilter";
import { Sort } from "./sort";
import { Populate } from "./populate";
import { FUNCTION_NAMES } from "./queryfunction";
import { Paging } from "./paging";

type Filter = ConditionalQueryFilter | QueryFilter;

interface Dictionary<T> {
    [key: string]: T;
}

// TODO - do we really need to export all of these, or just buildQuery?
export const queryBuilder = {
    buildQuery: buildQuery,
    addFilters: addFilters,
    addSortOrder: addSortOrder,
    addPopulates: addPopulates,
    addPaging: addPaging,
    addFunction: addFunction,
    addSelects: addSelects
};

/**
 * Build Query
 *
 * @param query
 * @param qm
 * @param listConfig
 */
function buildQuery(query: Query<any>, qm: QueryModel, listConfig?: any): void {

    // Build Query using QM Filters
    addFilters(query, qm.getFilters());

    const listFilters = qm.getListFilters();
    if (listFilters && listFilters.length) {
        addListFilters(query, listFilters, listConfig);
    }

    // Add Pagination
    if (qm.isPaginated()) {

        addPaging(query, {
            offset: qm.getOffset(),
            limit: qm.getLimit()
        });
    }

    // Check if we are doing a function query (COUNT/DISTINCT) - if so, add the function
    if (qm.isHasFunction()) {
        addFunction(query, qm, listConfig);
    }
    // Otherwise, we're doing a straight up "select" style query
    else {

        if (qm.isSortable()) {
            addSortOrder(query, qm.getSorts());
        }
        addPopulates(query, qm.getPopulates());
        addSelects(query, qm.getSelects());
        addLean(query, qm.getLean());
    }
}

/**
 * Build and add query
 *
 * @param query {Query}
 * @param filters {Array}
 */
function addFilters(query: Query<any>, filters: Filter[]): void {

    filters.forEach((filter: Filter) => {

        if (ConditionalQueryFilter.isConditional(filter)) {

            const conditions = parseConditionalQueries(filter);
            if (filter.filterType === CONDITIONAL_FILTER_TYPES.OR) {

                query.or(conditions);
            }
            else if (filter.filterType === CONDITIONAL_FILTER_TYPES.AND) {

                query.and(conditions);
            }
            return;
        }

        const filterType = filter.filterType;

        if (filterType === FILTER_TYPES.EQUALS) {

            query.where(filter.fieldName).equals(filter.value);
        }
        else if (filterType === FILTER_TYPES.REGEXP) {

            const value = filter.value || "";
            const options = filter.options;
            const regexVal = new RegExp(value, options);
            query.where(filter.fieldName).regex(regexVal);
        }
        else if (filterType === FILTER_TYPES.NOT && Array.isArray(filter.value)) {

            query.where(filter.fieldName).nin(filter.value);
        }
        else if (filterType === FILTER_TYPES.NOT) {

            query.where(filter.fieldName).ne(filter.value);
        }
        else if (filterType === FILTER_TYPES.IN) {

            let value = filter.value;
            if (!Array.isArray(filter.value)) {
                value = [].concat(value);
            }
            query.where(filter.fieldName).in(value);
        }
        else if (filterType === FILTER_TYPES.GT) {

            query.where(filter.fieldName).gt(filter.value);
        }
        else if (filterType === FILTER_TYPES.LT) {

            query.where(filter.fieldName).lt(filter.value);
        }
        else if (filterType === FILTER_TYPES.MATCH) {

            query.where(filter.fieldName).elemMatch(filter.value);
        }
        else if (filterType === FILTER_TYPES.SIZE) {

            query.where(filter.fieldName).size(filter.value);
        }
        else if (filterType === FILTER_TYPES.EXISTS) {

            query.where(filter.fieldName).exists(filter.value);
        }
        else {
            throw new Error(`Unrecognized filter type in queryBuilder.addFilters: ${filter.filterType}`);
        }
    });
}

/**
 * For each list filter, look up field name in list config to find corresponding to field name and add
 * as filter.
 *
 * @param query {Object}
 * @param listFilters {Object[]}
 * @param listConfig {Object}
 */
function addListFilters(query: Query<any>, listFilters: any[], listConfig: any): void {

    listFilters.forEach((listFilter: any) => {

        const fieldName = listConfig.getQueryOn(listFilter.fieldName);
        if (listFilter.filterType === FILTER_TYPES.EQUALS) {

            query.where(fieldName).equals(listFilter.value);
        }
        else if (listFilter.filterType === FILTER_TYPES.LT) {

            query.where(fieldName).lt(listFilter.value);
        }
        else if (listFilter.filterType === FILTER_TYPES.GT) {

            query.where(fieldName).gt(listFilter.value);
        }
        else {

            throw new Error(`Unrecognized filter type in QueryBuilder.addListFilters: ${listFilter.filterType}`);
        }
    });
}

/**
 * Add sort order
 *
 * @param query {Query}
 * @param sorts {Array}
 */
function addSortOrder(query: Query<any>, sorts: Sort[]): void {

    if (!sorts.length) {
        return;
    }

    const sortConfig: Dictionary<"asc"|"desc"> = {};
    sorts.forEach((sort: Sort) => {
        sortConfig[sort.fieldName] = sort.asc ? "asc" : "desc";
    });
    query.sort(sortConfig);
}
/**
 * Add populates
 *
 * @param query {Query}
 * @param populates {Array}
 */
function addPopulates(query: Query<any>, populates: Populate[]): void {

    if (!populates || !populates.length) {
        return;
    }

    populates.forEach((populate: Populate) => {

        if (populate.childrenFieldNames && populate.childrenFieldNames.length) {

            query.populate({
                path: populate.fieldName,
                select: populate.childrenFieldNames.join(" ")
            });
        }
        else {
            query.populate(populate.fieldName);
        }
    });
}

/**
 * Add Paging
 *
 * @param query {Query}
 * @param paging {{offset: Number, limit: Number}}
 */
function addPaging(query: Query<any>, paging: Paging): void {

    if (!paging) {
        return;
    }

    if (typeof paging.offset === "number") {
        query.skip(paging.offset);
    }

    if (typeof paging.limit === "number") {
        query.limit(paging.limit);
    }
}

/**
 * Add Function
 *
 * @param query {Query}
 * @param qm {Object}
 * @param listConfig {Object=}
 */
function addFunction(query: Query<any>, qm: QueryModel, listConfig: any): void {

    const fn = qm.getFn();
    if (!fn) {
        return;
    }

    if (fn.name === FUNCTION_NAMES.COUNT) {

        query.count();
    }
    else if (fn.name === FUNCTION_NAMES.DISTINCT) {

        const distinctKey: string = qm.getDistinct();

        if (!listConfig) {
            query.distinct(distinctKey);
        }
        else {
            query.distinct(listConfig.getFilterOn(distinctKey));
        }
    }
}

/**
 * Add Selects
 *
 * @param query {Query}
 * @param selects {string}
 */
function addSelects(query: Query<any>, selects: string): void {

    if (!selects) {
        return;
    }
    query.select(selects);
}

/**
 * Set as lean
 *
 * @param query {Query}
 * @param lean {Boolean}
 */
function addLean(query: Query<any>, lean: boolean): void {

    if (!lean) {
        return;
    }
    query.lean(lean);
}

/**
 * PRIVATES
 */

/**
 * Parse AND/OR queries
 *
 * @param filter
 * @returns {Array}
 */
function parseConditionalQueries(filter: ConditionalQueryFilter): any[] {

    return filter.conditions.map((filter: QueryFilter) => {

        const condition: Dictionary<any> = {};

        if (filter.filterType === FILTER_TYPES.EQUALS) {

            condition[filter.fieldName] = filter.value;
        }
        else if (filter.filterType === FILTER_TYPES.NOT) {

            condition[filter.fieldName] = {
                "$ne": filter.value
            };
        }
        else if (filter.filterType === FILTER_TYPES.IN) {

            condition[filter.fieldName] = {
                "$in": filter.value
            };
        }
        else if (filter.filterType === FILTER_TYPES.MATCH) {

            condition[filter.fieldName] = {
                "$elemMatch": filter.value
            };
        }
        else if (filter.filterType === FILTER_TYPES.SIZE) {

            condition[filter.fieldName] = {
                "$size": filter.value
            };
        }
        else if (filter.filterType === FILTER_TYPES.REGEXP) {

            const options: string = filter.options;
            condition[filter.fieldName] = new RegExp(filter.value, options);
        }
        // TODO - else? should there be a non-queryfilter option for hand-built AND/OR queries?
        return condition;
    });
}
