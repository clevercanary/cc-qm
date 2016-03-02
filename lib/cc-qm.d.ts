/**
 * cc-qm Definitions
 */
declare module "cc-qm" {

    import * as mongoose from "mongoose";
    type Query<T> = mongoose.Query<T>

    interface QueryFilter {
        filterType: string;
        fieldName: string;
        value: any|any[];
    }

    interface ConditionalFilter {
        filterType: string;
        conditions: QueryFilter[];
    }

    type Filter = QueryFilter|ConditionalFilter;

    interface RequestParams {
        query: {
            filters: any[];
            sorts: string[];
            populates: string[]
            listFilters: any[];
            fn: {name:string};
            offset: number;
            limit: number;
            distinct: string;
        }
    }

    export class QueryModel {

        constructor(RequestParams?)

        filters: any[];
        sorts: string[];
        populates: string[];
        listFilters: any[];
        fn: {name:string};
        offset: number;
        limit: number;
        paginated: boolean;
        sortable: boolean;

        isHasFunction():boolean;
        setPaginated(paginated:boolean):void;
        isPaginated():boolean;
        clearPagination():void;
        setSortable(sortable:boolean):void;
        isSortable():boolean;
        initFrom(QueryModel):QueryModel

        /**
         * Add filters
         */
        addEqualsQueryFilter(fieldName:string, value:any):void;
        addInQueryFilter(fieldName:string, value:any):void;
        addNotQueryFilter(fieldName:string, value:any):void;
        addOrQueryFilter(conditions:QueryFilter[]):void;
        addAndQueryFilter(conditions:QueryFilter[]):void;
        addGtQueryFilter(fieldName:string, value:any):void;
        addLtQueryFilter(fieldName:string, value:any):void;
        addRegexpQueryFilter(fieldName:string, value:string):void;
        addMatchQueryFilter(fieldName:string, value:any):void;
        addSizeQueryFilter(fieldName:string, value:any):void;

        /**
         * Build Filters
         */
        buildEqualsQueryFilter(fieldName:string, value:any):QueryFilter;
        buildInQueryFilter(fieldName:string, value:any):QueryFilter;
        buildNotQueryFilter(fieldName:string, value:any):QueryFilter;
        buildGtQueryFilter(fieldName:string, value:any):QueryFilter;
        buildLtQueryFilter(fieldName:string, value:any):QueryFilter;
        buildSizeQueryFilter(fieldName:string, value:any):QueryFilter;
        buildMatchQueryFilter(fieldName:string, value:any):QueryFilter;
        buildAndQueryFilter(conditions:QueryFilter[]):ConditionalFilter;
        buildOrQueryFilter(conditions:QueryFilter[]):ConditionalFilter;

        /**
         * Get/Set Operators
         */
        addPopulates(fieldName:string, childrenFieldNames?:string[]):void;
        addSort(fieldName: string, asc:boolean):void;
        addSelects(fields:string):void;
        getFilters():QueryFilter[];
        getListFilters():string[];
        getFn():{ name:string };
        getLimit():number;
        getOffset():number;
        getPopulates():string[];
        getSorts():string[];
        getSelects():string;
        getLean():boolean;
        setAsCountFunction():void;
        getDistinct():string;
        setDistinct(key:string):void;
        setLimit(limit:number):void;
        setOffset(offset:number):void;
        setLean(lean:boolean):void;
    }


    interface Sort {
        fieldName: string;
        asc: boolean;
    }

    interface Populate {
        fieldName: string;
        childrenFieldNames: string[];
    }

    interface Paging {
        offset:number;
        limit:number;
    }

    interface QueryBuilder {
        buildQuery<T>(query:Query<T>, qm:QueryModel, listConfig?:Object):void;
        addFilters<T>(query:Query<T>, filters:Filter[]):void;
        addSortOrder<T>(query:Query<T>, sorts:Sort[]):void;
        addPopulates<T>(query:Query<T>, populates:Populate):void;
        addPaging<T>(query:Query<T>, paging:Paging):void;
        addFunction<T>(query:Query<T>, qm:QueryModel, listConfig):void;
        addSelects<T>(query:Query<T>, selects:string):void;
        addLean<T>(query:Query<T>, lean:boolean):void;
    }
    export var queryBuilder: QueryBuilder;
}

