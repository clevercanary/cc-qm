"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * CC Query Model
 */
var queryfilter_1 = require("./filter/queryfilter");
var conditional_queryfilter_1 = require("./filter/conditional-queryfilter");
var queryfunction_1 = require("./queryfunction");
/**
 * Query Model Constructor
 *
 * @param req {Request}
 * @constructor
 */
var QueryModel = (function () {
    function QueryModel(req) {
        this.paginated = false;
        this.sortable = false;
        this.filters = [];
        this.sorts = [];
        this.populates = [];
        this.listFilters = [];
        this.distinct = "";
        this.selected = "";
        this.lean = false;
        if (req) {
            this.sortable = true;
            this.initFromRequest(req.query);
        }
    }
    /**
     * Check if QM has a function type
     *
     * @returns {boolean}
     */
    QueryModel.prototype.isHasFunction = function () {
        return !!this.fn;
    };
    /**
     * Set Paginated
     *
     * @param paginated
     * @returns {QueryModel}
     */
    QueryModel.prototype.setPaginated = function (paginated) {
        this.paginated = paginated;
        return this;
    };
    /**
     * Check for pagination
     *
     * @returns {boolean}
     */
    QueryModel.prototype.isPaginated = function () {
        return this.paginated;
    };
    /**
     * Clear Pagination settings
     *
     * @returns {QueryModel}
     */
    QueryModel.prototype.clearPagination = function () {
        this.paginated = false;
        this.offset = null;
        this.limit = null;
        return this;
    };
    /**
     * Set QM as sortable
     *
     * @param sortable
     * @returns {QueryModel}
     */
    QueryModel.prototype.setSortable = function (sortable) {
        this.sortable = sortable;
        return this;
    };
    /**
     * Check sortable settings
     *
     * @returns {boolean}
     */
    QueryModel.prototype.isSortable = function () {
        return this.sortable;
    };
    /**
     * Add Populate Fields
     *
     * @param fieldName
     * @param childrenFieldNames
     * @returns {QueryModel}
     */
    QueryModel.prototype.addPopulates = function (fieldName, childrenFieldNames) {
        this.populates.push({
            fieldName: fieldName,
            childrenFieldNames: childrenFieldNames
        });
        return this;
    };
    /**
     * Add Sort field
     *
     * @param fieldName
     * @param asc
     * @returns {QueryModel}
     */
    QueryModel.prototype.addSort = function (fieldName, asc) {
        this.sorts.push({
            fieldName: fieldName,
            asc: asc
        });
        return this;
    };
    /**
     * Add Select Fields
     *
     * @param fields
     */
    QueryModel.prototype.addSelects = function (fields) {
        if (!this.selected) {
            this.selected = "";
        }
        this.selected += (" " + fields);
        return this;
    };
    /**
     * Get Filters
     *
     * @returns {Filter[]}
     */
    QueryModel.prototype.getFilters = function () {
        if (!this.filters) {
            this.filters = [];
        }
        return this.filters;
    };
    /**
     * Get List Filters
     *
     * @returns {any[]}
     */
    QueryModel.prototype.getListFilters = function () {
        return this.listFilters;
    };
    /**
     * Get Function Type
     *
     * @returns {string}
     */
    QueryModel.prototype.getFn = function () {
        return this.fn;
    };
    /**
     * Get Limit
     *
     * @returns {string|number}
     */
    QueryModel.prototype.getLimit = function () {
        return this.limit;
    };
    /**
     * Get Offset
     *
     * @returns {string|number}
     */
    QueryModel.prototype.getOffset = function () {
        return this.offset;
    };
    /**
     * Get Populates
     *
     * @returns {Populate[]}
     */
    QueryModel.prototype.getPopulates = function () {
        if (!this.populates) {
            this.populates = [];
        }
        return this.populates;
    };
    /**
     * Get Sorts
     *
     * @returns {Sort[]}
     */
    QueryModel.prototype.getSorts = function () {
        if (!this.sorts) {
            this.sorts = [];
        }
        return this.sorts;
    };
    /**
     * Get Selects
     *
     * @returns {string}
     */
    QueryModel.prototype.getSelects = function () {
        if (!this.selected) {
            this.selected = "";
        }
        return this.selected;
    };
    /**
     * Get Lean
     *
     * @returns {[]}
     */
    QueryModel.prototype.getLean = function () {
        if (!this.lean) {
            this.lean = false;
        }
        return this.lean;
    };
    /**
     * Set As COUNT Function
     *
     * @returns {QueryModel}
     */
    QueryModel.prototype.setAsCountFunction = function () {
        this.fn = {
            name: queryfunction_1.FUNCTION_NAMES.COUNT
        };
        this.clearPagination();
        return this;
    };
    /**
     * Get Distinct
     *
     * @returns {boolean}
     */
    QueryModel.prototype.getDistinct = function () {
        return this.distinct;
    };
    /**
     * Set Distinct
     *
     * @param distinct
     * @returns {QueryModel}
     */
    QueryModel.prototype.setDistinct = function (distinct) {
        this.distinct = distinct;
        this.fn = {
            name: queryfunction_1.FUNCTION_NAMES.DISTINCT
        };
        this.clearPagination();
        return this;
    };
    /**
     * Set Limit
     *
     * @param limit
     * @returns {QueryModel}
     */
    QueryModel.prototype.setLimit = function (limit) {
        if (typeof limit === "number") {
            this.limit = limit;
        }
        else if (typeof limit === "string") {
            this.limit = parseInt(limit, 10);
        }
        // TODO - else throw an error?
        return this;
    };
    /**
     * Set Offset
     *
     * @param offset
     * @returns {QueryModel}
     */
    QueryModel.prototype.setOffset = function (offset) {
        if (typeof offset === "number") {
            this.offset = offset;
        }
        else if (typeof offset === "string") {
            this.offset = parseInt(offset, 10);
        }
        // TODO - else throw an error?
        return this;
    };
    /**
     * Set Limit
     *
     * @param lean
     * @returns {QueryModel}
     */
    QueryModel.prototype.setLean = function (lean) {
        this.lean = lean;
        return this;
    };
    /**
     * ADD FILTERS
     */
    /**
     * Add EQUALS Query Filter
     *
     * @param fieldName
     * @param value
     * @returns {QueryModel}
     */
    QueryModel.prototype.addEqualsQueryFilter = function (fieldName, value) {
        var filter = this.buildEqualsQueryFilter(fieldName, value);
        this.filters.push(filter);
        return this;
    };
    /**
     * Add IN Query Filter
     *
     * @param fieldName
     * @param values
     * @returns {QueryModel}
     */
    QueryModel.prototype.addInQueryFilter = function (fieldName, values) {
        var filter = this.buildInQueryFilter(fieldName, values);
        this.filters.push(filter);
        return this;
    };
    /**
     * Add NOT Query Filter
     *
     * @param fieldName
     * @param value
     * @returns {QueryModel}
     */
    QueryModel.prototype.addNotQueryFilter = function (fieldName, value) {
        var filter = this.buildNotQueryFilter(fieldName, value);
        this.filters.push(filter);
        return this;
    };
    /**
     * Add GT Query Filter
     *
     * @param fieldName
     * @param value
     * @returns {QueryModel}
     */
    QueryModel.prototype.addGtQueryFilter = function (fieldName, value) {
        var filter = this.buildGtQueryFilter(fieldName, value);
        this.filters.push(filter);
        return this;
    };
    /**
     * Add LT Query Filter
     *
     * @param fieldName
     * @param value
     * @returns {QueryModel}
     */
    QueryModel.prototype.addLtQueryFilter = function (fieldName, value) {
        var filter = this.buildLtQueryFilter(fieldName, value);
        this.filters.push(filter);
        return this;
    };
    /**
     * Add MATCH Query Filter
     *
     * @param fieldName
     * @param value
     * @returns {QueryModel}
     */
    QueryModel.prototype.addMatchQueryFilter = function (fieldName, value) {
        var filter = this.buildMatchQueryFilter(fieldName, value);
        this.filters.push(filter);
        return this;
    };
    /**
     * Add REGEXP Query Filter
     *
     * @param fieldName
     * @param value
     * @param options
     * @returns {QueryModel}
     */
    QueryModel.prototype.addRegexpQueryFilter = function (fieldName, value, options) {
        var filter = this.buildRegexpQueryFilter(fieldName, value, options);
        this.filters.push(filter);
        return this;
    };
    /**
     * Add SIZE Query Filter
     *
     * @param fieldName
     * @param value
     * @returns {QueryModel}
     */
    QueryModel.prototype.addSizeQueryFilter = function (fieldName, value) {
        var filter = this.buildSizeQueryFilter(fieldName, value);
        this.filters.push(filter);
        return this;
    };
    /**
     * Add OR Conditional Query Filter
     * @param conditions
     * @returns {QueryModel}
     */
    QueryModel.prototype.addOrQueryFilter = function (conditions) {
        var filter = this.buildOrQueryFilter(conditions);
        this.filters.push(filter);
        return this;
    };
    /**
     * Add AND Conditional Query Filter
     * @param conditions
     * @returns {QueryModel}
     */
    QueryModel.prototype.addAndQueryFilter = function (conditions) {
        var filter = this.buildAndQueryFilter(conditions);
        this.filters.push(filter);
        return this;
    };
    /**
     * BUILD FILTERS
     */
    /**
     * Build EQUALS Query Filter
     *
     * @param fieldName
     * @param value
     * @returns {QueryFilter}
     */
    QueryModel.prototype.buildEqualsQueryFilter = function (fieldName, value) {
        return {
            filterType: queryfilter_1.FILTER_TYPES.EQUALS,
            fieldName: fieldName,
            value: value
        };
    };
    /**
     * Build IN Query Filter
     *
     * @param fieldName
     * @param values
     * @returns {QueryFilter}
     */
    QueryModel.prototype.buildInQueryFilter = function (fieldName, values) {
        return {
            filterType: queryfilter_1.FILTER_TYPES.IN,
            fieldName: fieldName,
            value: values
        };
    };
    /**
     * Build NOT Query Filter
     *
     * @param fieldName
     * @param value
     * @returns {QueryFilter}
     */
    QueryModel.prototype.buildNotQueryFilter = function (fieldName, value) {
        return {
            filterType: queryfilter_1.FILTER_TYPES.NOT,
            fieldName: fieldName,
            value: value
        };
    };
    /**
     * Build GT Query Filter
     *
     * @param fieldName
     * @param value
     * @returns {QueryFilter}
     */
    QueryModel.prototype.buildGtQueryFilter = function (fieldName, value) {
        return {
            filterType: queryfilter_1.FILTER_TYPES.GT,
            fieldName: fieldName,
            value: value
        };
    };
    /**
     * Build LT Query Filter
     *
     * @param fieldName
     * @param value
     * @returns {QueryFilter}
     */
    QueryModel.prototype.buildLtQueryFilter = function (fieldName, value) {
        return {
            filterType: queryfilter_1.FILTER_TYPES.LT,
            fieldName: fieldName,
            value: value
        };
    };
    /**
     * Build MATCH Query Filter
     *
     * @param fieldName
     * @param value
     * @returns {QueryFilter}
     */
    QueryModel.prototype.buildMatchQueryFilter = function (fieldName, value) {
        return {
            filterType: queryfilter_1.FILTER_TYPES.MATCH,
            fieldName: fieldName,
            value: value
        };
    };
    /**
     * Build REGEXP Query Filter
     *
     * @param fieldName
     * @param value
     * @param [options]
     * @returns {QueryFilter}
     */
    QueryModel.prototype.buildRegexpQueryFilter = function (fieldName, value, options) {
        return {
            filterType: queryfilter_1.FILTER_TYPES.REGEXP,
            fieldName: fieldName,
            value: value,
            options: options || ""
        };
    };
    /**
     * Build SIZE Query Filter
     *
     * @param fieldName
     * @param value
     * @returns {QueryFilter}
     */
    QueryModel.prototype.buildSizeQueryFilter = function (fieldName, value) {
        return {
            filterType: queryfilter_1.FILTER_TYPES.SIZE,
            fieldName: fieldName,
            value: value
        };
    };
    /**
     * Build OR Conditional Query Filter
     *
     * @param conditions
     * @returns {ConditionalQueryFilter}
     */
    QueryModel.prototype.buildOrQueryFilter = function (conditions) {
        return {
            filterType: conditional_queryfilter_1.CONDITIONAL_FILTER_TYPES.OR,
            conditions: conditions
        };
    };
    /**
     * Build AND Conditional Query Filter
     *
     * @param conditions
     * @returns {ConditionalQueryFilter}
     */
    QueryModel.prototype.buildAndQueryFilter = function (conditions) {
        return {
            filterType: conditional_queryfilter_1.CONDITIONAL_FILTER_TYPES.AND,
            conditions: conditions
        };
    };
    /**
     * Grab Properties from QM
     *
     * @returns {QueryRequest}
     */
    QueryModel.prototype.toObject = function () {
        return {
            offset: this.offset,
            limit: this.limit,
            fn: this.fn,
            filters: this.filters,
            sorts: this.sorts,
            populates: this.populates,
            listFilters: this.listFilters,
            distinct: this.distinct
        };
    };
    /**
     * Initalize QueryModel from existing QueryModel
     * - performs shallow copy of filters
     *
     * @param fromQm
     * @returns {QueryModel}
     */
    QueryModel.prototype.initFrom = function (fromQm) {
        this.initFromRequest(fromQm.toObject());
        this.setLean(fromQm.lean);
        return this;
    };
    /**
     * Check if a filter is conditional
     *
     * @param filter
     * @returns {boolean}
     */
    QueryModel.isConditionalQueryFilter = function (filter) {
        return Array.isArray(filter.conditions);
    };
    /**
     * Initialize QueryModel from HTTP Request.query or existing QueryModel
     *
     * @param query
     */
    QueryModel.prototype.initFromRequest = function (query) {
        this.filters = query.filters || [];
        this.sorts = query.sorts || [];
        this.populates = query.populates || [];
        this.listFilters = query.listFilters || [];
        this.fn = query.fn;
        this.initPagination(query);
        if (query.distinct) {
            this.setDistinct(query.distinct);
        }
    };
    /**
     * Initialize Pagination
     *
     * @param query
     */
    QueryModel.prototype.initPagination = function (query) {
        this.setPaginated(!!(query.offset || query.limit));
        if (query.offset !== undefined) {
            this.setOffset(query.offset);
        }
        if (query.limit !== undefined) {
            this.setLimit(query.limit);
        }
    };
    return QueryModel;
}());
exports.QueryModel = QueryModel;
//# sourceMappingURL=QueryModel.js.map