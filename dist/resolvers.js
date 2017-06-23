"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const requireAll = require("require-all");
const path = require("path");
const flow = require("lodash/fp/flow");
const map = require("lodash/fp/map");
const mapValues = require("lodash/fp/mapValues");
const values = require("lodash/fp/values");
const compact = require("lodash/fp/compact");
function default_1(resolversDir, app) {
    const domains = requireAll(path.join(app.config.baseDirPath, resolversDir));
    const getMainFunction = (pSchemas, field) => flow(mapValues(field), values, compact)(pSchemas);
    const getResolver = (pSchemas, field) => flow(map((resolver) => resolver(app)), map(field), values, compact)(pSchemas);
    const defaults = getMainFunction(domains, 'default');
    const resolveFunctions = {
        Query: Object.assign({}, ...getResolver(defaults, 'Query')),
        Mutation: Object.assign({}, ...getResolver(defaults, 'Mutation'))
        // Subscription: {
        //   postUpvoted (post) {
        //     return post
        //   }
        // }
    };
    return Object.assign(resolveFunctions, ...getResolver(defaults, 'Root'));
}
exports.default = default_1;
//# sourceMappingURL=resolvers.js.map