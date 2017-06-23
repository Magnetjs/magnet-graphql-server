"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const requireAll = require("require-all");
const path = require("path");
const flow = require("lodash/fp/flow");
const mapValues = require("lodash/fp/mapValues");
const values = require("lodash/fp/values");
function default_1(schemasDir, { config }) {
    const getSchema = (pSchemas, field) => flow(mapValues((schema) => {
        return schema.default || schema;
    }), mapValues(field), values)(pSchemas);
    let schemas = requireAll(path.join(config.baseDirPath, schemasDir));
    const combinedQuery = getSchema(schemas, 'Query');
    const queries = combinedQuery.length ? `type Query { ${combinedQuery.join('')} }` : '';
    const combinedMutation = getSchema(schemas, 'Mutation');
    const mutations = combinedMutation.length ? `type Mutation { ${combinedMutation.join('')} }` : '';
    const td = getSchema(schemas, 'Schema');
    td.push(`${queries} ${mutations}`);
    // type Subscription {
    //   postUpvoted: Profile
    // }
    return td;
}
exports.default = default_1;
//# sourceMappingURL=typeDefs.js.map