"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONDITIONAL_FILTER_TYPES = {
    OR: "OR",
    AND: "AND"
};
var ConditionalQueryFilter = (function () {
    function ConditionalQueryFilter() {
    }
    ConditionalQueryFilter.isConditional = function (filter) {
        return Array.isArray(filter.conditions);
    };
    return ConditionalQueryFilter;
}());
exports.ConditionalQueryFilter = ConditionalQueryFilter;
//# sourceMappingURL=conditional-queryfilter.js.map