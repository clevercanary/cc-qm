/**
 * CC Query Model
 */
import { QueryFilter, FILTER_TYPES } from "./filter/queryfilter";
import { ConditionalQueryFilter, CONDITIONAL_FILTER_TYPES } from "./filter/conditional-queryfilter";
import { Sort } from "./sort";
import { Populate } from "./populate"
import { QueryFunction, FUNCTION_NAMES } from "./queryfunction"

export type Filter = QueryFilter | ConditionalQueryFilter;

export interface QueryRequest {
    offset?: number | string;
    limit?: number | string;
    filters?: Filter[];
    sorts?: Sort[];
    populates?: Populate[];
    listFilters?: any[];
    fn?: QueryFunction;
    distinct?: string;
    selected?: string;
}

/**
 * Query Model Constructor
 *
 * @param req {Request}
 * @constructor
 */
export class QueryModel {

    private paginated?: boolean = false;
    private sortable?: boolean = false;
    private offset?: number;
    private limit?: number;
    private fn?: QueryFunction;
    private filters?: Filter[] = [];
    private sorts?: Sort[] = [];
    private populates?: Populate[] = [];
    private listFilters?: any[] = [];
    private distinct?: string = "";
    private selected?: string = "";
    private lean?: boolean = false;

    constructor(req?: { query: QueryRequest }) {
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
    isHasFunction(): boolean {
        return !!this.fn;
    }

    /**
     * Set Paginated
     *
     * @param paginated
     * @returns {QueryModel}
     */
    setPaginated(paginated: boolean): QueryModel {
        this.paginated = paginated;
        return this;
    }

    /**
     * Check for pagination
     *
     * @returns {boolean}
     */
    isPaginated(): boolean {
        return this.paginated;
    }

    /**
     * Clear Pagination settings
     *
     * @returns {QueryModel}
     */
    clearPagination(): QueryModel {
        this.paginated = false;
        this.offset = null;
        this.limit = null;
        return this;
    }

    /**
     * Set QM as sortable
     *
     * @param sortable
     * @returns {QueryModel}
     */
    setSortable(sortable: boolean): QueryModel {
        this.sortable = sortable;
        return this;
    }

    /**
     * Check sortable settings
     *
     * @returns {boolean}
     */
    isSortable(): boolean {
        return this.sortable;
    }

    /**
     * Add Populate Fields
     *
     * @param fieldName
     * @param childrenFieldNames
     * @returns {QueryModel}
     */
    addPopulates(fieldName: string, childrenFieldNames?: string[]): QueryModel {

        this.populates.push({
            fieldName: fieldName,
            childrenFieldNames: childrenFieldNames
        });
        return this;
    }

    /**
     * Add Sort field
     *
     * @param fieldName
     * @param asc
     * @returns {QueryModel}
     */
    addSort(fieldName: string, asc: boolean): QueryModel {

        this.sorts.push({
            fieldName: fieldName,
            asc: asc
        });
        return this;
    }

    /**
     * Add Select Fields
     *
     * @param fields
     */
    addSelects(fields: string): QueryModel {

        if (!this.selected) {
            this.selected = "";
        }
        this.selected += (" " + fields);
        return this;
    }

    /**
     * Get Filters
     *
     * @returns {Filter[]}
     */
    getFilters(): Filter[] {

        if (!this.filters) {
            this.filters = [];
        }
        return this.filters;
    }

    /**
     * Get List Filters
     *
     * @returns {any[]}
     */
    getListFilters(): any {
        return this.listFilters;
    }

    /**
     * Get Function Type
     *
     * @returns {string}
     */
    getFn(): QueryFunction {
        return this.fn;
    }

    /**
     * Get Limit
     *
     * @returns {string|number}
     */
    getLimit(): number {
        return this.limit;
    }

    /**
     * Get Offset
     *
     * @returns {string|number}
     */
    getOffset(): number {
        return this.offset;
    }

    /**
     * Get Populates
     *
     * @returns {Populate[]}
     */
    getPopulates(): Populate[] {

        if (!this.populates) {
            this.populates = [];
        }
        return this.populates;
    }

    /**
     * Get Sorts
     *
     * @returns {Sort[]}
     */
    getSorts(): Sort[] {

        if (!this.sorts) {
            this.sorts = [];
        }
        return this.sorts;
    }

    /**
     * Get Selects
     *
     * @returns {string}
     */
    getSelects(): string {

        if (!this.selected) {
            this.selected = "";
        }
        return this.selected;
    }

    /**
     * Get Lean
     *
     * @returns {[]}
     */
    getLean(): boolean {

        if (!this.lean) {
            this.lean = false;
        }
        return this.lean;
    }

    /**
     * Set As COUNT Function
     *
     * @returns {QueryModel}
     */
    setAsCountFunction(): QueryModel {
        this.fn = {
            name: FUNCTION_NAMES.COUNT
        };
        this.clearPagination();
        return this;
    }

    /**
     * Get Distinct
     *
     * @returns {boolean}
     */
    getDistinct(): string {
        return this.distinct;
    }

    /**
     * Set Distinct
     *
     * @param distinct
     * @returns {QueryModel}
     */
    setDistinct(distinct: string): QueryModel {
        this.distinct = distinct;
        this.fn = {
            name: FUNCTION_NAMES.DISTINCT
        };
        
        this.clearPagination();

        return this;
    }

    /**
     * Set Limit
     *
     * @param limit
     * @returns {QueryModel}
     */
    setLimit(limit: number | string): QueryModel {

        if (typeof limit === "number") {
            this.limit = limit;
        }
        else if (typeof limit === "string") {
            this.limit = parseInt(limit, 10);
        }
        // TODO - else throw an error?
        return this;
    }

    /**
     * Set Offset
     *
     * @param offset
     * @returns {QueryModel}
     */
    setOffset(offset: number | string): QueryModel {

        if (typeof offset === "number") {
            this.offset = offset;
        }
        else if (typeof offset === "string") {
            this.offset = parseInt(offset, 10);
        }
        // TODO - else throw an error?
        return this;
    }

    /**
     * Set Limit
     *
     * @param lean
     * @returns {QueryModel}
     */
    setLean(lean: boolean): QueryModel {
        this.lean = lean;
        return this;
    }

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
    addEqualsQueryFilter(fieldName: string, value: any): QueryModel {

        const filter = this.buildEqualsQueryFilter(fieldName, value);
        this.filters.push(filter);
        return this;
    }

    /**
     * Add IN Query Filter
     *
     * @param fieldName
     * @param values
     * @returns {QueryModel}
     */
    addInQueryFilter(fieldName: string, values: any[]): QueryModel {

        const filter = this.buildInQueryFilter(fieldName, values);
        this.filters.push(filter);
        return this;
    }

    /**
     * Add NOT Query Filter
     *
     * @param fieldName
     * @param value
     * @returns {QueryModel}
     */
    addNotQueryFilter(fieldName: string, value: any): QueryModel {

        const filter = this.buildNotQueryFilter(fieldName, value);
        this.filters.push(filter);
        return this;
    }


    /**
     * Add GT Query Filter
     *
     * @param fieldName
     * @param value
     * @returns {QueryModel}
     */
    addGtQueryFilter(fieldName: string, value: any): QueryModel {

        const filter = this.buildGtQueryFilter(fieldName, value);
        this.filters.push(filter);
        return this;
    }


    /**
     * Add LT Query Filter
     *
     * @param fieldName
     * @param value
     * @returns {QueryModel}
     */
    addLtQueryFilter(fieldName: string, value: any): QueryModel {

        const filter = this.buildLtQueryFilter(fieldName, value);
        this.filters.push(filter);
        return this;
    }

    /**
     * Add MATCH Query Filter
     *
     * @param fieldName
     * @param value
     * @returns {QueryModel}
     */
    addMatchQueryFilter(fieldName: string, value: Object): QueryModel {

        const filter = this.buildMatchQueryFilter(fieldName, value);
        this.filters.push(filter);
        return this;
    }

    /**
     * Add REGEXP Query Filter
     *
     * @param fieldName
     * @param value
     * @param options
     * @returns {QueryModel}
     */
    addRegexpQueryFilter(fieldName: string, value: string | RegExp, options?: string): QueryModel {

        const filter = this.buildRegexpQueryFilter(fieldName, value, options);
        this.filters.push(filter);
        return this;
    }

    /**
     * Add SIZE Query Filter
     *
     * @param fieldName
     * @param value
     * @returns {QueryModel}
     */
    addSizeQueryFilter(fieldName: string, value: any): QueryModel {

        const filter = this.buildSizeQueryFilter(fieldName, value);
        this.filters.push(filter);
        return this;
    }

    /**
     * Add OR Conditional Query Filter
     * @param conditions
     * @returns {QueryModel}
     */
    addOrQueryFilter(conditions: any[]): QueryModel {

        const filter = this.buildOrQueryFilter(conditions);
        this.filters.push(filter);
        return this;
    }


    /**
     * Add AND Conditional Query Filter
     * @param conditions
     * @returns {QueryModel}
     */
    addAndQueryFilter(conditions: any[]): QueryModel {

        const filter = this.buildAndQueryFilter(conditions);
        this.filters.push(filter);
        return this;
    }

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
    buildEqualsQueryFilter(fieldName: string, value: any): QueryFilter {

        return {
            filterType: FILTER_TYPES.EQUALS,
            fieldName: fieldName,
            value: value
        }
    }

    /**
     * Build IN Query Filter
     *
     * @param fieldName
     * @param values
     * @returns {QueryFilter}
     */
    buildInQueryFilter(fieldName: string, values: any[]): QueryFilter {

        return {
            filterType: FILTER_TYPES.IN,
            fieldName: fieldName,
            value: values
        }
    }

    /**
     * Build NOT Query Filter
     *
     * @param fieldName
     * @param value
     * @returns {QueryFilter}
     */
    buildNotQueryFilter(fieldName: string, value: any): QueryFilter {

        return {
            filterType: FILTER_TYPES.NOT,
            fieldName: fieldName,
            value: value
        }
    }


    /**
     * Build GT Query Filter
     *
     * @param fieldName
     * @param value
     * @returns {QueryFilter}
     */
    buildGtQueryFilter(fieldName: string, value: any): QueryFilter {

        return {
            filterType: FILTER_TYPES.GT,
            fieldName: fieldName,
            value: value
        }
    }

    /**
     * Build LT Query Filter
     *
     * @param fieldName
     * @param value
     * @returns {QueryFilter}
     */
    buildLtQueryFilter(fieldName: string, value: any): QueryFilter {

        return {
            filterType: FILTER_TYPES.LT,
            fieldName: fieldName,
            value: value
        }
    }

    /**
     * Build MATCH Query Filter
     *
     * @param fieldName
     * @param value
     * @returns {QueryFilter}
     */
    buildMatchQueryFilter(fieldName: string, value: Object): QueryFilter {

        return {
            filterType: FILTER_TYPES.MATCH,
            fieldName: fieldName,
            value: value
        }
    }

    /**
     * Build REGEXP Query Filter
     *
     * @param fieldName
     * @param value
     * @param [options]
     * @returns {QueryFilter}
     */
    buildRegexpQueryFilter(fieldName: string, value: string | RegExp, options?: string): QueryFilter {

        return {
            filterType: FILTER_TYPES.REGEXP,
            fieldName: fieldName,
            value: value,
            options: options || ""
        };
    }

    /**
     * Build SIZE Query Filter
     *
     * @param fieldName
     * @param value
     * @returns {QueryFilter}
     */
    buildSizeQueryFilter(fieldName: string, value: any): QueryFilter {

        return {
            filterType: FILTER_TYPES.SIZE,
            fieldName: fieldName,
            value: value
        }
    }

    /**
     * Build OR Conditional Query Filter
     *
     * @param conditions
     * @returns {ConditionalQueryFilter}
     */
    buildOrQueryFilter(conditions: any[]): ConditionalQueryFilter {

        return {
            filterType: CONDITIONAL_FILTER_TYPES.OR,
            conditions: conditions
        }
    }

    /**
     * Build AND Conditional Query Filter
     *
     * @param conditions
     * @returns {ConditionalQueryFilter}
     */
    buildAndQueryFilter(conditions: any[]): ConditionalQueryFilter {

        return {
            filterType: CONDITIONAL_FILTER_TYPES.AND,
            conditions: conditions
        }
    }

    /**
     * Grab Properties from QM
     *
     * @returns {QueryRequest}
     */
    toObject(): QueryRequest {

        return {
            offset: this.offset,
            limit: this.limit,
            fn: this.fn,
            filters: this.filters,
            sorts: this.sorts,
            populates: this.populates,
            listFilters: this.listFilters,
            distinct: this.distinct
        }
    }


    /**
     * Initalize QueryModel from existing QueryModel
     * - performs shallow copy of filters
     *
     * @param fromQm
     * @returns {QueryModel}
     */
    initFrom(fromQm: QueryModel): QueryModel {

        this.initFromRequest(fromQm.toObject());
        this.setLean(fromQm.lean);
        return this;
    }

    /**
     * Check if a filter is conditional
     * 
     * @param filter
     * @returns {boolean}
     */
    static isConditionalQueryFilter(filter: Filter): filter is ConditionalQueryFilter {
        return Array.isArray((<ConditionalQueryFilter>filter).conditions);
    }

    /**
     * Initialize QueryModel from HTTP Request.query or existing QueryModel
     *
     * @param query
     */
    private initFromRequest(query: QueryRequest) {

        this.filters = query.filters || [];
        this.sorts = query.sorts || [];
        this.populates = query.populates || [];

        this.listFilters = query.listFilters || [];

        this.fn = query.fn;

        this.initPagination(query);

        if ( query.distinct ) {
            this.setDistinct(query.distinct);
        }
    }

    /**
     * Initialize Pagination
     *
     * @param query
     */
    private initPagination(query: QueryRequest) {

        this.setPaginated(!!(query.offset || query.limit));
        if (query.offset !== undefined) {
            this.setOffset(query.offset);
        }
        if (query.limit !== undefined) {
            this.setLimit(query.limit);
        }
    }
}




