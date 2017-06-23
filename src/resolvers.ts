import * as requireAll from 'require-all'
import * as path from 'path'
import * as flow from 'lodash/fp/flow'
import * as map from 'lodash/fp/map'
import * as mapValues from 'lodash/fp/mapValues'
import * as values from 'lodash/fp/values'
import * as compact from 'lodash/fp/compact'

export default function (resolversDir, app) {
  const domains = requireAll(path.join(app.config.baseDirPath, resolversDir))
  const getMainFunction = (pSchemas, field) => flow(
    mapValues(field),
    values,
    compact
  )(pSchemas)

  const getResolver = (pSchemas, field) => flow(
    map((resolver) => resolver(app)),
    map(field),
    values,
    compact
  )(pSchemas)

  const defaults = getMainFunction(domains, 'default')

  const resolveFunctions = {
    Query: Object.assign({},
      ...getResolver(defaults, 'Query')
    ),

    Mutation: Object.assign({},
      ...getResolver(defaults, 'Mutation')
    )

    // Subscription: {
    //   postUpvoted (post) {
    //     return post
    //   }
    // }
  }

  return Object.assign(resolveFunctions,
    ...getResolver(defaults, 'Root')
  )
}
