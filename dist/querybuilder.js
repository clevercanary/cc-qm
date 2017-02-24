"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var conditional_queryfilter_1 = require("./filter/conditional-queryfilter");
var queryfilter_1 = require("./filter/queryfilter");
var queryfunction_1 = require("./queryfunction");
// TODO - do we really need to export all of these, or just buildQuery?
exports.queryBuilder = {
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
function buildQuery(query, qm, listConfig) {
    // Build Query using QM Filters
    addFilters(query, qm.getFilters());
    var listFilters = qm.getListFilters();
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
function addFilters(query, filters) {
    filters.forEach(function (filter) {
        if (conditional_queryfilter_1.ConditionalQueryFilter.isConditional(filter)) {
            var conditions = parseConditionalQueries(filter);
            if (filter.filterType === conditional_queryfilter_1.CONDITIONAL_FILTER_TYPES.OR) {
                query.or(conditions);
            }
            else if (filter.filterType === conditional_queryfilter_1.CONDITIONAL_FILTER_TYPES.AND) {
                query.and(conditions);
            }
            return;
        }
        var filterType = filter.filterType;
        if (filterType === queryfilter_1.FILTER_TYPES.EQUALS) {
            query.where(filter.fieldName).equals(filter.value);
        }
        else if (filterType === queryfilter_1.FILTER_TYPES.REGEXP) {
            var value = filter.value || "";
            var options = filter.options;
            var regexVal = new RegExp(value, options);
            query.where(filter.fieldName).regex(regexVal);
        }
        else if (filterType === queryfilter_1.FILTER_TYPES.NOT && Array.isArray(filter.value)) {
            query.where(filter.fieldName).nin(filter.value);
        }
        else if (filterType === queryfilter_1.FILTER_TYPES.NOT) {
            query.where(filter.fieldName).ne(filter.value);
        }
        else if (filterType === queryfilter_1.FILTER_TYPES.IN) {
            var value = filter.value;
            if (!Array.isArray(filter.value)) {
                value = [].concat(value);
            }
            query.where(filter.fieldName).in(value);
        }
        else if (filterType === queryfilter_1.FILTER_TYPES.GT) {
            query.where(filter.fieldName).gt(filter.value);
        }
        else if (filterType === queryfilter_1.FILTER_TYPES.LT) {
            query.where(filter.fieldName).lt(filter.value);
        }
        else if (filterType === queryfilter_1.FILTER_TYPES.MATCH) {
            query.where(filter.fieldName).elemMatch(filter.value);
        }
        else if (filterType === queryfilter_1.FILTER_TYPES.SIZE) {
            query.where(filter.fieldName).size(filter.value);
        }
        else {
            throw new Error("Unrecognized filter type in queryBuilder.addFilters: " + filter.filterType);
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
function addListFilters(query, listFilters, listConfig) {
    listFilters.forEach(function (listFilter) {
        var fieldName = listConfig.getQueryOn(listFilter.fieldName);
        if (listFilter.filterType === queryfilter_1.FILTER_TYPES.EQUALS) {
            query.where(fieldName).equals(listFilter.value);
        }
        else if (listFilter.filterType === queryfilter_1.FILTER_TYPES.LT) {
            query.where(fieldName).lt(listFilter.value);
        }
        else if (listFilter.filterType === queryfilter_1.FILTER_TYPES.GT) {
            query.where(fieldName).gt(listFilter.value);
        }
        else {
            throw new Error("Unrecognized filter type in QueryBuilder.addListFilters: " + listFilter.filterType);
        }
    });
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
    sorts.forEach(function (sort) {
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
function addPopulates(query, populates) {
    if (!populates || !populates.length) {
        return;
    }
    populates.forEach(function (populate) {
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
function addPaging(query, paging) {
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
function addFunction(query, qm, listConfig) {
    var fn = qm.getFn();
    if (!fn) {
        return;
    }
    if (fn.name === queryfunction_1.FUNCTION_NAMES.COUNT) {
        query.count();
    }
    else if (fn.name === queryfunction_1.FUNCTION_NAMES.DISTINCT) {
        var distinctKey = qm.getDistinct();
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
function addSelects(query, selects) {
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
function addLean(query, lean) {
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
function parseConditionalQueries(filter) {
    return filter.conditions.map(function (filter) {
        var condition = {};
        if (filter.filterType === queryfilter_1.FILTER_TYPES.EQUALS) {
            condition[filter.fieldName] = filter.value;
        }
        else if (filter.filterType === queryfilter_1.FILTER_TYPES.NOT) {
            condition[filter.fieldName] = {
                "$ne": filter.value
            };
        }
        else if (filter.filterType === queryfilter_1.FILTER_TYPES.IN) {
            condition[filter.fieldName] = {
                "$in": filter.value
            };
        }
        else if (filter.filterType === queryfilter_1.FILTER_TYPES.MATCH) {
            condition[filter.fieldName] = {
                "$elemMatch": filter.value
            };
        }
        else if (filter.filterType === queryfilter_1.FILTER_TYPES.SIZE) {
            condition[filter.fieldName] = {
                "$size": filter.value
            };
        }
        else if (filter.filterType === queryfilter_1.FILTER_TYPES.REGEXP) {
            var options = filter.options;
            condition[filter.fieldName] = new RegExp(filter.value, options);
        }
        // TODO - else? should there be a non-queryfilter option for hand-built AND/OR queries?
        return condition;
    });
}
//# sourceMappingURL=querybuilder.js.map