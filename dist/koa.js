"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const module_1 = require("magnet-core/module");
const graphql_tools_1 = require("graphql-tools");
const graphql_server_koa_1 = require("graphql-server-koa");
const graphql_apollo_errors_1 = require("graphql-apollo-errors");
const path = require("path");
const omit = require("lodash/omit");
const resolvers_1 = require("./resolvers");
const typeDefs_1 = require("./typeDefs");
class MagnetGraphqlServerKoa extends module_1.Module {
    get moduleName() { return 'graphql-server'; }
    get defaultConfig() { return __dirname; }
    setup() {
        return __awaiter(this, void 0, void 0, function* () {
            const formatError = graphql_apollo_errors_1.formatErrorGenerator({
                // logger: this.log,
                publicDataPath: 'public',
                showLocations: !this.app.config.env.prod,
                showPath: !this.app.config.env.prod,
                hideSensitiveData: this.app.config.env.prod,
                hooks: {
                    // This run on the error you really throw from your code (not the graphql error - it means not with path and locations)
                    onOriginalError: (originalError) => { this.log.error(originalError.message); },
                    // This will run on the processed error, which means after we convert it to boom error if needed
                    // and after we added the path and location (if requested)
                    // If the error is not a boom error, this error won't include the original message but general internal server error message
                    // This will run before we take only the payload and the public path of data
                    onProcessedError: (processedError) => { this.log.error(processedError.message); },
                    // This will run on the final error, it will only contains the output.payload, and if you configured the publicDataPath
                    // it will only contain this data under the data object
                    // If the error is internal error this error will be a wrapped internal error which not contains the sensitive details
                    // This is the error which will be sent to the client
                    onFinalError: (finalError) => { this.log.error(finalError.message); }
                }
            });
            const scalars = omit(require(path.join(this.app.config.baseDirPath, this.config.scalarFile)).default, 'Schema');
            const schema = graphql_tools_1.makeExecutableSchema({
                typeDefs: typeDefs_1.default(this.config.schemasDir, this.app),
                resolvers: Object.assign(scalars, resolvers_1.default(this.config.resolversDir, this.app))
            });
            this.insert(graphql_server_koa_1.graphqlKoa((ctx) => __awaiter(this, void 0, void 0, function* () {
                return ({
                    formatError,
                    schema,
                    context: { state: ctx.state }
                });
            })), 'graphqlServerKoa');
        });
    }
}
exports.default = MagnetGraphqlServerKoa;
//# sourceMappingURL=koa.js.map