import { Module } from 'magnet-core/module'
import { makeExecutableSchema } from 'graphql-tools'
import { graphqlKoa } from 'graphql-server-koa'
import { formatErrorGenerator } from 'graphql-apollo-errors'
import * as path from 'path'
import * as omit from 'lodash/omit'

import resolvers from './resolvers'
import typeDefs from './typeDefs'

export default class Graphql extends Module {
  get moduleName () { return 'graphql' }
  get defaultConfig () { return __dirname }

  async setup () {
    const formatError = formatErrorGenerator({
      // logger: this.log,
      publicDataPath: 'public', // Only data under this path in the data object will be sent to the client (path parts should be separated by . - some.public.path)
      showLocations: !this.app.config.env.prod, // whether to add the graphql locations to the final error (default false)
      showPath: !this.app.config.env.prod, // whether to add the graphql path to the final error (default false)
      hideSensitiveData: this.app.config.env.prod, // whether to remove the data object from internal server errors (default true)
      hooks: {
        // This run on the error you really throw from your code (not the graphql error - it means not with path and locations)
        onOriginalError: (originalError) => { this.log.error(originalError.message) },
        // This will run on the processed error, which means after we convert it to boom error if needed
        // and after we added the path and location (if requested)
        // If the error is not a boom error, this error won't include the original message but general internal server error message
        // This will run before we take only the payload and the public path of data
        onProcessedError: (processedError) => { this.log.error(processedError.message) },
        // This will run on the final error, it will only contains the output.payload, and if you configured the publicDataPath
        // it will only contain this data under the data object
        // If the error is internal error this error will be a wrapped internal error which not contains the sensitive details
        // This is the error which will be sent to the client
        onFinalError: (finalError) => { this.log.error(finalError.message) }
      }
    })

    const scalars = omit(
      require(path.join(this.app.config.baseDirPath, this.config.scalarFile)).default,
      'Schema'
    )

    const schema = makeExecutableSchema({
      typeDefs: typeDefs(this.config.schemasDir, this.app),
      resolvers: Object.assign(
        scalars,
        resolvers(this.config.resolversDir, this.app)
      )
    })

    this.insert(graphqlKoa(async (ctx) => ({
      formatError,
      schema,
      context: { state: ctx.state }
    })), 'graphqlKoa')
  }
}
