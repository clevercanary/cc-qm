/**
 * CC Query Builder
 */

"use strict";

var FUNCTION_NAMES = {
    COUNT: "COUNT",
    DISTINCT: "DISTINCT"
};

/**
 * Build Query
 *
 * @param query {Query}
 * @param qm {QueryModel}
 * @param listConfig {Object=}
 */
exports.buildQuery = function(query, qm, listConfig) {

    // Build up query filters
    addFilters(query, qm.getFilters());

    var listFilters = qm.getListFilters();
    if ( listFilters && listFilters.length ) {
        addListFilters(query, listFilters, listConfig);
    }

    // Add pagination
    if ( qm.isPaginated() ) {

        addPaging(query, {
            offset: qm.getOffset(),
            limit: qm.getLimit()
        });
    }

    // Check if we are doing a function query (eg COUNT) - if so, add the function
    if ( qm.isHasFunction( ) ) {
        addFunction(query, qm, listConfig);
    }
    // Otherwise we"re doing a straight up "select" style query - add sorts,
    // populates etc
    else {

        if ( qm.isSortable() ) {
            addSortOrder(query, qm.getSorts());
        }

        addPopulates(query, qm.getPopulates());
        addSelects(query, qm.getSelects());
        addLean(query, qm.getLean());
    }
};

/**
 * Build and add query
 *
 * @param query {Query}
 * @param filters {Array}
 */
function addFilters(query, filters) {

    for (var i = 0; i < filters.length; i++) {

        var filter = filters[i];
        var value;
        var conditions;

        if (filter.filterType === "EQUALS") {

            query.where(filter.fieldName).equals(filter.value);
        }
        else if( filter.filterType === "REGEXP" ) {

            value = filter.value || "";
            var regexVal = new RegExp(value,  "i");
            query.where(filter.fieldName).regex(regexVal);
        }
        else if ( filter.filterType === "IN" ) {

            value = filter.value;
            if (!Array.isArray(value)) {
                value = [].concat(value);
            }
            query.where(filter.fieldName).in(value);
        }
        else if (filter.filterType === "OR") {

            conditions = parseConditionalQueries(filter);
            query.or(conditions);
        }
        else if (filter.filterType === "AND") {

            conditions = parseConditionalQueries(filter);
            query.and(conditions);
        }
        else if ( filter.filterType === "NOT" && Array.isArray(filter.value) ) {

            query.where(filter.fieldName).nin(filter.value);
        }
        else if (filter.filterType === "NOT") {

            query.where(filter.fieldName).ne(filter.value);
        }
        else if (filter.filterType === "LT") {

            query.where(filter.fieldName).lt(filter.value);
        }
        else if (filter.filterType === "GT") {

            query.where(filter.fieldName).gt(filter.value);
        }
        else if (filter.filterType === "MATCH") {

            query.where(filter.fieldName).elemMatch(filter.value);
        }
        else if (filter.filterType === "SIZE") {

            query.where(filter.fieldName).size(filter.value);
        }
        else {

            throw "Unrecognized filter type in QueryBuilder.addFilters: " + filter.filterType;
        }
    }
}
exports.addFilters = addFilters;

/**
 * For each list filter, look up field name in list config to find corresponding to field name and add
 * as filter.
 *
 * @param query {Object}
 * @param listFilters {Object[]}
 * @param listConfig {Object}
 */
function addListFilters(query, listFilters, listConfig) {

    for (var i = 0; i < listFilters.length; i++) {

        var listFilter = listFilters[i];
        var fieldName = listConfig.getQueryOn(listFilter.fieldName);
        if (listFilter.filterType === "EQUALS") {

            query.where(fieldName).equals(listFilter.value);
        }
        else if (listFilter.filterType === "LT") {

            query.where(fieldName).lt(listFilter.value);
        }
        else if (listFilter.filterType === "GT") {

            query.where(fieldName).gt(listFilter.value);
        }
        else {

            throw "Unrecognized filter type in QueryBuilder.addListFilters: " + listFilter.filterType;
        }
    }
}

/**
 * Add sort order
 *
 * @param query {Query}
 * @param sorts {Array}
 */
function addSortOrder(query, sorts) {

    if (!sorts.length) {
        return;
    }

    var sortConfig = {};
    for (var i = 0; i < sorts.length; i++) {

        var sort = sorts[i];
        sortConfig[sort.fieldName] = sort.asc ? "asc" : "desc";
    }

    query.sort(sortConfig);
}
exports.addSortOrder = addSortOrder;

/**
 * Add populates
 *
 * @param query {Query}
 * @param populates {Array}
 */
function addPopulates(query, populates) {

    if ( !populates || !populates.length ) {
        return;
    }

    for (var i = 0; i < populates.length; i++) {

        var populate = populates[i];

        if ( populate.childrenFieldNames && populate.childrenFieldNames.length ) {

            query.populate({
                path: populate.fieldName,
                select: populate.childrenFieldNames.join(" ")
            });
        }
        else {
            query.populate(populate.fieldName);
        }

    }
}
exports.addPopulates = addPopulates;

/**
 * Add Paging
 *
 * @param query {Query}
 * @param paging {{offset: Number, limit: Number}}
 */
function addPaging(query, paging) {

    // no paging fetch all the rows
    if (!paging || !paging.offset || !paging.limit) {
        return;
    }

    // starting page
    var offset = parseInt(paging.offset, 10);

    // end page
    var limit = parseInt(paging.limit, 10);

    query.skip(offset).limit(limit);
}
exports.addPaging = addPaging;

/**
 * Add Function
 *
 * @param query {Query}
 * @param qm {Object}
 * @param listConfig {Object=}
 */
function addFunction(query, qm, listConfig) {

    var fn = qm.getFn();
    if ( !fn ) {
        return;
    }

    if ( fn.name === FUNCTION_NAMES.COUNT ) {

        query.count();
    }
    else if ( fn.name === FUNCTION_NAMES.DISTINCT ) {

        var distinctKey = qm.getDistinct();
        query.distinct(listConfig.getFilterOn(distinctKey));
    }
}
exports.addFunction = addFunction;

/**
 * Add Selects
 *
 * @param query {Query}
 * @param selects {string}
 */
function addSelects(query, selects) {

    if ( !selects ) {
        return;
    }

    query.select(selects);
}
exports.addSelects = addSelects;

/**
 * Set as lean
 *
 * @param query {Query}
 * @param lean {Boolean}
 */
function addLean(query, lean) {

    if ( !lean ) {
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
function parseConditionalQueries (filter) {

    var conditions = [];
    var condition;
    for (var j = 0; j < filter.conditions.length; j++) {

        var conditionDefinition = filter.conditions[j];

        if (conditionDefinition.filterType === "EQUALS") {

            condition = {};
            condition[conditionDefinition.fieldName] = conditionDefinition.value;
            conditions.push(condition);
        }
        else if (conditionDefinition.filterType === "IN") {

            condition = {};
            condition[conditionDefinition.fieldName] = {
                "$in": conditionDefinition.value
            };
            conditions.push(condition);
        }
        else if (conditionDefinition.filterType === "MATCH") {

            condition = {};
            condition[conditionDefinition.fieldName] = {
                $elemMatch: conditionDefinition.value
            };
            conditions.push(condition);
        }
        else if (conditionDefinition.filterType === "SIZE") {

            condition = {};
            condition[conditionDefinition.fieldName] = {
                $size: conditionDefinition.value
            };
            conditions.push(condition);
        }
    }
    return conditions;
}
