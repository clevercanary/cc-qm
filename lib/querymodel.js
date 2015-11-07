/**
 * CC Query Model
 */

"use strict";

/**
 * Constants
 *
 * @type {{EQUALS: string, IN: string, NOT: string, OR: string, AND: string, REGEXP: string, GT: string, LT: string, MATCH: string, SIZE: string}}
 */
var FILTER_TYPES = {
    EQUALS: "EQUALS",
    IN: "IN",
    NOT: "NOT",
    OR: "OR",
    AND: "AND",
    REGEXP: "REGEXP",
    GT: "GT",
    LT: "LT",
    MATCH: "MATCH",
    SIZE: "SIZE"
};

var FUNCTION_NAMES = {
    COUNT: "COUNT",
    DISTINCT: "DISTINCT"
};

/**
 * Query Model Constructor
 *
 * @param req {Request}
 * @constructor
 */
var QueryModel = function (req) {

    if ( req ) {

        this.paginated = !!(req.query.offset || req.query.limit);
        this.sortable = true;
        init.call(this, req.query);
    }
};

/**
 * Return has Function
 *
 * @returns {boolean}
 */
QueryModel.prototype.isHasFunction = function() {

    return !!this.fn;
};

/**
 * Set Paginated
 *
 * @param paginated {boolean}
 */
QueryModel.prototype.setPaginated = function(paginated) {

    this.paginated = paginated;
};

/**
 * Return is Paginated
 *
 * @returns {boolean}
 */
QueryModel.prototype.isPaginated = function() {

    return this.paginated;
};

/**
 * Clear Pagination
 */
QueryModel.prototype.clearPagination = function() {

    this.offset = null;
    this.limit = null;
};

/**
 * Set is Sortable
 *
 * @param sortable {boolean}
 */
QueryModel.prototype.setSortable = function(sortable) {

    this.sortable = sortable;
};

/**
 * Return is Sortable
 *
 * @returns {boolean}
 */
QueryModel.prototype.isSortable = function() {

    return this.sortable;
};

/**
 * Initialize from existing instance
 *
 * @param fromQm {QueryModel}
 */
QueryModel.prototype.initFrom = function(fromQm) {

    this.paginated = fromQm.paginated;
    init.call(this, fromQm);
};

/**
 * ADD FILTERS
 */

/**
 * Add EQUALS Filter
 *
 * @param fieldName {string}
 * @param value {*}
 */
QueryModel.prototype.addEqualsQueryFilter = function(fieldName, value) {

    var filter = this.buildEqualsQueryFilter(fieldName, value);
    this.getFilters().push(filter);
};

/**
 * Add IN Filter
 *
 * @param fieldName {string}
 * @param value {Array|*}
 */
QueryModel.prototype.addInQueryFilter = function(fieldName, value) {

    var filter = this.buildInQueryFilter(fieldName, value);
    this.getFilters().push(filter);
};

/**
 * Add NOT Filter
 * @param fieldName {string}
 * @param value {*}
 */
QueryModel.prototype.addNotQueryFilter = function(fieldName, value) {

    var filter = this.buildNotQueryFilter(fieldName, value);
    this.getFilters().push(filter);
};

/**
 * Add OR Filter
 *
 * @param conditions {Array}
 */
QueryModel.prototype.addOrQueryFilter = function(conditions) {

    var filter = this.buildOrQueryFilter(conditions);
    this.getFilters().push(filter);
};

/**
 * Add AND Filter
 *
 * @param conditions {Array}
 */
QueryModel.prototype.addAndQueryFilter = function(conditions) {

    var filter = this.buildAndQueryFilter(conditions);
    this.getFilters().push(filter);
};

/**
 * Add GT Filter
 *
 * @param fieldName {string}
 * @param value {*}
 */
QueryModel.prototype.addGtQueryFilter = function(fieldName, value) {

    var filter = this.buildGtQueryFilter(fieldName, value);
    this.getFilters().push(filter);
};

/**
 * Add LT Filter
 *
 * @param fieldName {string}
 * @param value {*}
 */
QueryModel.prototype.addLtQueryFilter = function(fieldName, value) {

    var filter = this.buildLtQueryFilter(fieldName, value);
    this.getFilters().push(filter);
};

/**
 * Add REGEXP Filter
 *
 * @param fieldName {string}
 * @param regexpString {string}
 */
QueryModel.prototype.addRegexpQueryFilter = function(fieldName, regexpString) {

    this.getFilters().push({
        filterType: FILTER_TYPES.REGEXP,
        fieldName: fieldName,
        value: regexpString
    });
};

/**
 * Add MATCH Filter
 *
 * @param fieldName {string}
 * @param value {Object}
 */
QueryModel.prototype.addMatchQueryFilter = function(fieldName, value) {

    var filter = this.buildMatchQueryFilter(fieldName, value);
    this.getFilters().push(filter);
};

/**
 * Add Array SIZE Filter
 *
 * @param fieldName {string}
 * @param value {Number}
 */
QueryModel.prototype.addSizeQueryFilter = function(fieldName, value) {

    var filter = this.buildSizeQueryFilter(fieldName, value);
    this.getFilters().push(filter);
};

/**
 * BUILD FILTERS
 */

/**
 * Build EQUALS Filter
 *
 * @param fieldName {string}
 * @param value {*}
 * @returns {{filterType: string, fieldName: string, value: *}}
 */
QueryModel.prototype.buildEqualsQueryFilter = function(fieldName, value) {

    return buildQueryFilter.call(this, FILTER_TYPES.EQUALS, fieldName, value);
};

/**
 * Build IN Filter
 *
 * @param fieldName {string}
 * @param value {Array}
 * @returns {{filterType: string, fieldName: string, value: *}}
 */
QueryModel.prototype.buildInQueryFilter = function(fieldName, value) {

    return buildQueryFilter.call(this, FILTER_TYPES.IN, fieldName, value);
};

/**
 * Build NOT Filter
 *
 * @param fieldName {string}
 * @param value {*}
 * @returns {{filterType: string, fieldName: string, value: *}}
 */
QueryModel.prototype.buildNotQueryFilter = function(fieldName, value) {

    return buildQueryFilter.call(this, FILTER_TYPES.NOT, fieldName, value);
};

/**
 * Build GT Filter
 *
 * @param fieldName {string}
 * @param value {*}
 * @returns {{filterType: string, fieldName: string, value: *}}
 */
QueryModel.prototype.buildGtQueryFilter = function(fieldName, value) {

    return buildQueryFilter.call(this, FILTER_TYPES.GT, fieldName, value);
};

/**
 * Build LT Filter
 *
 * @param fieldName {string}
 * @param value {*}
 * @returns {{filterType: string, fieldName: string, value: *}}
 */
QueryModel.prototype.buildLtQueryFilter = function(fieldName, value) {

    return buildQueryFilter.call(this, FILTER_TYPES.LT, fieldName, value);
};

/**
 * Build Array SIZE Filter
 *
 * @param fieldName {string}
 * @param value {Number}
 * @returns {{filterType: string, fieldName: string, value: *}}
 */
QueryModel.prototype.buildSizeQueryFilter = function(fieldName, value) {

    return buildQueryFilter.call(this, FILTER_TYPES.SIZE, fieldName, value);
};

/**
 * Build MATCH Filter
 *
 * @param fieldName {string}
 * @param value {Object}
 * @returns {{filterType: string, fieldName: string, value: Object}}
 */
QueryModel.prototype.buildMatchQueryFilter = function(fieldName, value) {

    return buildQueryFilter.call(this, FILTER_TYPES.MATCH, fieldName, value);
};

/**
 * Build AND Filter
 *
 * @param conditions {Array}
 * @returns {{filterType: string, conditions: Array}}
 */
QueryModel.prototype.buildAndQueryFilter = function(conditions) {

    return buildConditionalQueryFilter.call(this, FILTER_TYPES.AND, conditions);
};

/**
 * Build OR Filter
 *
 * @param conditions {Array}
 * @returns {{filterType: string, conditions: Array}}
 */
QueryModel.prototype.buildOrQueryFilter = function(conditions) {

    return buildConditionalQueryFilter.call(this, FILTER_TYPES.OR, conditions);
};

/**
 * Add Populates
 *
 * @param fieldName {string}
 * @param childrenFieldNames {Array}
 */
QueryModel.prototype.addPopulates = function(fieldName, childrenFieldNames) {

    this.getPopulates().push({
        fieldName: fieldName,
        childrenFieldNames: childrenFieldNames
    });
};

/**
 * Add Sort Order
 *
 * @param fieldName {string}
 * @param asc {boolean}
 */
QueryModel.prototype.addSort = function (fieldName, asc) {

    this.getSorts().push({
        fieldName: fieldName,
        asc: asc
    });
};

/**
 * Append Selects Fields
 *
 * @param fields {string}
 */
QueryModel.prototype.addSelects = function (fields) {

    if ( !this.selected ) {
        this.selected = "";
    }
    this.selected += (" " + fields);
};

/**
 * Get Filters
 *
 * @returns {Array}
 */
QueryModel.prototype.getFilters = function() {

    if ( !this.filters ) {
        this.filters = [];
    }
    return this.filters;
};

/**
 * Get Function
 *
 * @returns {{name: string}}
 */
QueryModel.prototype.getFn = function() {

    return this.fn;
};

/**
 *
 * @returns {null|number|*}
 */
QueryModel.prototype.getLimit = function () {

    return this.limit;
};

/**
 * Get Offset
 *
 * @returns {null|number}
 */
QueryModel.prototype.getOffset = function () {

    return this.offset;
};

/**
 * Get Populates
 *
 * @returns {Array}
 */
QueryModel.prototype.getPopulates = function() {

    if ( !this.populates ) {
        this.populates = [];
    }
    return this.populates;
};

/**
 * Get Sorts
 *
 * @returns {Array}
 */
QueryModel.prototype.getSorts = function() {

    if ( !this.sorts ) {
        this.sorts = [];
    }
    return this.sorts;
};

/**
 * Get Selects
 *
 * @returns {string}
 */
QueryModel.prototype.getSelects = function() {

    if ( !this.selected ) {
        this.selected = "";
    }
    return this.selected;
};

/**
 * Get Lean
 *
 * @returns {boolean}
 */
QueryModel.prototype.getLean = function() {

    if ( !this.lean ) {
        return false;
    }
    return this.lean;
};

/**
 * Set Function as Count
 */
QueryModel.prototype.setAsCountFunction = function() {

    this.fn = {
        name: FUNCTION_NAMES.COUNT
    };

    // Clear pagination
    this.clearPagination();
};

/**
 * Get distinct key
 */
QueryModel.prototype.getDistinct = function() {

    return this.distinct;
};

/**
 * Set function as distinct
 */
QueryModel.prototype.setDistinct = function(distinct) {

    this.distinct = distinct;

    this.fn = {
        name: FUNCTION_NAMES.DISTINCT
    };
};

/**
 * Set Limit
 *
 * @param limit {number}
 */
QueryModel.prototype.setLimit = function (limit) {

    this.limit = limit;
};

/**
 * Set Offset
 *
 * @param offset {number}
 */
QueryModel.prototype.setOffset = function (offset) {

    this.offset = offset;
};

/**
 * Set Lean
 *
 * @param lean {boolean}
 */
QueryModel.prototype.setLean = function (lean) {

    this.lean = lean;
};

/**
 * PRIVATES
 */

/**
 * Build Query Param
 *
 * @param filterType {string}
 * @param fieldName {string}
 * @param value {*}
 * @returns {{filterType: string, fieldName: string, value: *}}
 */
function buildQueryFilter(filterType, fieldName, value) {

    return {
        filterType: filterType,
        fieldName: fieldName,
        value: value
    };
}

/**
 * Build Conditional Query
 *
 * @param filterType {string}
 * @param conditions {Array}
 * @returns {{filterType: string, conditions: Array}}
 */
function buildConditionalQueryFilter(filterType, conditions) {

    return {
        filterType: filterType,
        conditions: conditions
    };
}

/**
 *
 * @param obj
 */
function init(obj) {
    /* jshint -W040 */

    this.filters = obj.filters || [];
    this.sorts = obj.sorts || [];
    this.populates = obj.populates || [];

    this.fn = obj.fn;

    this.offset = obj.offset;
    this.limit = obj.limit;

    var distinct = obj.distinct;
    if ( distinct ) {
        this.setDistinct(distinct);
    }
}

/**
 * Exports
 *
 * @type {Function}
 */
module.exports = exports = QueryModel;
