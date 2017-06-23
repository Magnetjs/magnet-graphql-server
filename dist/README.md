### Usage
Basic
```
import { fromNode, fromM, fromLocal } from 'magnet-core'

let app = await magnet([
  fromM('config'),
  fromM('bunyan'),
  fromM('folder-loader'),
  fromM('graphql-server'),
]);
```
