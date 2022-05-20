# Introduction

Leaderboard / ranker NodeJS library.

Optimized for ranking all users efficiently.

Less efficient leaderboard, which could be improved to use sort partitions and more natural DynamoDB. Currently it is a simple JSON blob.

# Usage

```
echo "@0xflicker:registry=https://npm.pkg.github.com" >> .npmrc
npm install @0xflicker/ranker
```

## Tables

By default the following tables will be used:

- boards
- scores
- nodes
- leaderboards

Table names can be configured with the following env vars:

- `TABLE_NAME_RANKER_BOARDS`
- `TABLE_NAME_RANKER_SCORES`
- `TABLE_NAME_RANKER_NODES`
- `TABLE_NAME_RANKER_LEADERBOARDS`

Or via the following config variable:

```
import { config } from '0xflicker/ranker';

config.tableNames.boards = 'my_boards_table';
config.tableNames.scores = 'my_scores_table';
config.tableNames.nodes = 'my_nodes_table';
config.tableNames.leaderboards = 'my_leaderboards_table';
```

## Creating a leaderboard

```
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { createRanker } from "0xflicker/ranker"

function createDb() {
  return DynamoDBDocumentClient.from(new DynamoDBClient(), {
    marshallOptions: {
      convertEmptyValues: true,
    },
  });
}

const db = createDb();
const ranker = await createRanker({
  rootKey: 'contest',   // Dynamo DB root key, like an id
  scoreRange,           // Min-max of ranker. Must be even length.
  branchingFactor,      // Ranking "bucket size". Best value is complicated
  leaderboardSize,      // optional number of entries to keep for leaderboard
  period,               // optional period after which to expire scores from ranking and leaderboard
  displayName,          // optional display name of the leaderboard
  description,          // optional long description
})
```

# Attribution

Converted to Typescript from https://github.com/Ruberik/google-app-engine-ranklist
License: Apache 2.0 (Open source w/ attribution)

Modifications:

- Python tuples generally converted to spread arrays
- Javascript version of Python array equality and range function
- Use DynamoDB instead of Firestore for storage
- Safe batching of writes
- Using debounce queue instead of transaction decorators
- Separately keeps track of a leaderboard as well as a ranking tree
- Scores support additional meta data past name and value

```

```
