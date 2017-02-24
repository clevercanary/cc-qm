/**
 * CC Query Model
 */
import { QueryFilter } from "./filter/queryfilter";
import { ConditionalQueryFilter } from "./filter/conditional-queryfilter";
import { Sort } from "./sort";
import { Populate } from "./populate";
import { QueryFunction } from "./queryfunction";
export declare type Filter = QueryFilter | ConditionalQueryFilter;
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
export declare class QueryModel {
    private paginated?;
    private sortable?;
    private offset?;
    private limit?;
    private fn?;
    private filters?;
    private sorts?;
    private populates?;
    private listFilters?;
    private distinct?;
    private selected?;
    private lean?;
    constructor(req?: {
        query: QueryRequest;
    });
    /**
     * Check if QM has a function type
     *
     * @returns {boolean}
     */
    isHasFunction(): boolean;
    /**
     * Set Paginated
     *
     * @param paginated
     * @returns {QueryModel}
     */
    setPaginated(paginated: boolean): QueryModel;
    /**
     * Check for pagination
     *
     * @returns {boolean}
     */
    isPaginated(): boolean;
    /**
     * Clear Pagination settings
     *
     * @returns {QueryModel}
     */
    clearPagination(): QueryModel;
    /**
     * Set QM as sortable
     *
     * @param sortable
     * @returns {QueryModel}
     */
    setSortable(sortable: boolean): QueryModel;
    /**
     * Check sortable settings
     *
     * @returns {boolean}
     */
    isSortable(): boolean;
    /**
     * Add Populate Fields
     *
     * @param fieldName
     * @param childrenFieldNames
     * @returns {QueryModel}
     */
    addPopulates(fieldName: string, childrenFieldNames?: string[]): QueryModel;
    /**
     * Add Sort field
     *
     * @param fieldName
     * @param asc
     * @returns {QueryModel}
     */
    addSort(fieldName: string, asc: boolean): QueryModel;
    /**
     * Add Select Fields
     *
     * @param fields
     */
    addSelects(fields: string): QueryModel;
    /**
     * Get Filters
     *
     * @returns {Filter[]}
     */
    getFilters(): Filter[];
    /**
     * Get List Filters
     *
     * @returns {any[]}
     */
    getListFilters(): any;
    /**
     * Get Function Type
     *
     * @returns {string}
     */
    getFn(): QueryFunction;
    /**
     * Get Limit
     *
     * @returns {string|number}
     */
    getLimit(): number;
    /**
     * Get Offset
     *
     * @returns {string|number}
     */
    getOffset(): number;
    /**
     * Get Populates
     *
     * @returns {Populate[]}
     */
    getPopulates(): Populate[];
    /**
     * Get Sorts
     *
     * @returns {Sort[]}
     */
    getSorts(): Sort[];
    /**
     * Get Selects
     *
     * @returns {string}
     */
    getSelects(): string;
    /**
     * Get Lean
     *
     * @returns {[]}
     */
    getLean(): boolean;
    /**
     * Set As COUNT Function
     *
     * @returns {QueryModel}
     */
    setAsCountFunction(): QueryModel;
    /**
     * Get Distinct
     *
     * @returns {boolean}
     */
    getDistinct(): string;
    /**
     * Set Distinct
     *
     * @param distinct
     * @returns {QueryModel}
     */
    setDistinct(distinct: string): QueryModel;
    /**
     * Set Limit
     *
     * @param limit
     * @returns {QueryModel}
     */
    setLimit(limit: number | string): QueryModel;
    /**
     * Set Offset
     *
     * @param offset
     * @returns {QueryModel}
     */
    setOffset(offset: number | string): QueryModel;
    /**
     * Set Limit
     *
     * @param lean
     * @returns {QueryModel}
     */
    setLean(lean: boolean): QueryModel;
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
    addEqualsQueryFilter(fieldName: string, value: any): QueryModel;
    /**
     * Add IN Query Filter
     *
     * @param fieldName
     * @param values
     * @returns {QueryModel}
     */
    addInQueryFilter(fieldName: string, values: any[]): QueryModel;
    /**
     * Add NOT Query Filter
     *
     * @param fieldName
     * @param value
     * @returns {QueryModel}
     */
    addNotQueryFilter(fieldName: string, value: any): QueryModel;
    /**
     * Add GT Query Filter
     *
     * @param fieldName
     * @param value
     * @returns {QueryModel}
     */
    addGtQueryFilter(fieldName: string, value: any): QueryModel;
    /**
     * Add LT Query Filter
     *
     * @param fieldName
     * @param value
     * @returns {QueryModel}
     */
    addLtQueryFilter(fieldName: string, value: any): QueryModel;
    /**
     * Add MATCH Query Filter
     *
     * @param fieldName
     * @param value
     * @returns {QueryModel}
     */
    addMatchQueryFilter(fieldName: string, value: Object): QueryModel;
    /**
     * Add REGEXP Query Filter
     *
     * @param fieldName
     * @param value
     * @param options
     * @returns {QueryModel}
     */
    addRegexpQueryFilter(fieldName: string, value: string | RegExp, options?: string): QueryModel;
    /**
     * Add SIZE Query Filter
     *
     * @param fieldName
     * @param value
     * @returns {QueryModel}
     */
    addSizeQueryFilter(fieldName: string, value: any): QueryModel;
    /**
     * Add OR Conditional Query Filter
     * @param conditions
     * @returns {QueryModel}
     */
    addOrQueryFilter(conditions: any[]): QueryModel;
    /**
     * Add AND Conditional Query Filter
     * @param conditions
     * @returns {QueryModel}
     */
    addAndQueryFilter(conditions: any[]): QueryModel;
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
    buildEqualsQueryFilter(fieldName: string, value: any): QueryFilter;
    /**
     * Build IN Query Filter
     *
     * @param fieldName
     * @param values
     * @returns {QueryFilter}
     */
    buildInQueryFilter(fieldName: string, values: any[]): QueryFilter;
    /**
     * Build NOT Query Filter
     *
     * @param fieldName
     * @param value
     * @returns {QueryFilter}
     */
    buildNotQueryFilter(fieldName: string, value: any): QueryFilter;
    /**
     * Build GT Query Filter
     *
     * @param fieldName
     * @param value
     * @returns {QueryFilter}
     */
    buildGtQueryFilter(fieldName: string, value: any): QueryFilter;
    /**
     * Build LT Query Filter
     *
     * @param fieldName
     * @param value
     * @returns {QueryFilter}
     */
    buildLtQueryFilter(fieldName: string, value: any): QueryFilter;
    /**
     * Build MATCH Query Filter
     *
     * @param fieldName
     * @param value
     * @returns {QueryFilter}
     */
    buildMatchQueryFilter(fieldName: string, value: Object): QueryFilter;
    /**
     * Build REGEXP Query Filter
     *
     * @param fieldName
     * @param value
     * @param [options]
     * @returns {QueryFilter}
     */
    buildRegexpQueryFilter(fieldName: string, value: string | RegExp, options?: string): QueryFilter;
    /**
     * Build SIZE Query Filter
     *
     * @param fieldName
     * @param value
     * @returns {QueryFilter}
     */
    buildSizeQueryFilter(fieldName: string, value: any): QueryFilter;
    /**
     * Build OR Conditional Query Filter
     *
     * @param conditions
     * @returns {ConditionalQueryFilter}
     */
    buildOrQueryFilter(conditions: any[]): ConditionalQueryFilter;
    /**
     * Build AND Conditional Query Filter
     *
     * @param conditions
     * @returns {ConditionalQueryFilter}
     */
    buildAndQueryFilter(conditions: any[]): ConditionalQueryFilter;
    /**
     * Grab Properties from QM
     *
     * @returns {QueryRequest}
     */
    toObject(): QueryRequest;
    /**
     * Initalize QueryModel from existing QueryModel
     * - performs shallow copy of filters
     *
     * @param fromQm
     * @returns {QueryModel}
     */
    initFrom(fromQm: QueryModel): QueryModel;
    /**
     * Check if a filter is conditional
     *
     * @param filter
     * @returns {boolean}
     */
    static isConditionalQueryFilter(filter: Filter): filter is ConditionalQueryFilter;
    /**
     * Initialize QueryModel from HTTP Request.query or existing QueryModel
     *
     * @param query
     */
    private initFromRequest(query);
    /**
     * Initialize Pagination
     *
     * @param query
     */
    private initPagination(query);
}
