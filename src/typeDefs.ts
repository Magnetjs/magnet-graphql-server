import * as requireAll from 'require-all'
import * as path from 'path'
import * as flow from 'lodash/fp/flow'
import * as mapValues from 'lodash/fp/mapValues'
import * as values from 'lodash/fp/values'

export default function (schemasDir, { config }) {
  const getSchema = (pSchemas, field) => flow(
    mapValues((schema) => {
      return schema.default || schema
    }),
    mapValues(field),
    values
  )(pSchemas)

  let schemas = requireAll(path.join(config.baseDirPath, schemasDir))

  const combinedQuery = getSchema(schemas, 'Query')
  const queries = combinedQuery.length ? `type Query { ${combinedQuery.join('')} }` : ''

  const combinedMutation = getSchema(schemas, 'Mutation')
  const mutations = combinedMutation.length ? `type Mutation { ${combinedMutation.join('')} }` : ''

  const td = getSchema(schemas, 'Schema')
  td.push(`${queries} ${mutations}`)
  // type Subscription {
  //   postUpvoted: Profile
  // }

  return td
}
