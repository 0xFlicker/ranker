import {
  DynamoDBDocumentClient,
  GetCommand,
  GetCommandInput,
  PutCommand,
  ScanCommand,
  ScanCommandInput,
  ScanCommandOutput,
} from "@aws-sdk/lib-dynamodb";
import { getTableName } from "../config";
import { TableBoard } from "../db/dynamodb";

export interface ICreateRanker {
  db: DynamoDBDocumentClient;
  rootKey: string;
  scoreRange: number[];
  branchingFactor: number;
  leaderboardSize?: number;
  period?: number;
  displayName?: string;
  description?: string;
}

export async function createRanker({
  db,
  rootKey,
  scoreRange,
  branchingFactor,
  leaderboardSize,
  period,
  displayName,
  description,
}: ICreateRanker) {
  // Sanity checking
  if (scoreRange.length <= 1) {
    throw new Error("Rankings must be a ranger of at least than 2");
  }
  if (scoreRange.length % 2 !== 0) {
    throw new Error("Rankings must be in pairs");
  }
  for (let i = 0; i < scoreRange.length; i += 2) {
    if (scoreRange[i] > scoreRange[i + 1]) {
      throw new Error(
        `Score pairs must be in ascending order and not ${scoreRange[i]}, ${
          scoreRange[i + 1]
        }`
      );
    }
  }
  if (branchingFactor <= 1) {
    throw new Error("Branching factor must be greater than 1");
  }
  const item: Record<string, any> = {
    Name: rootKey,
    Score_Range: scoreRange,
    Branching_Factor: branchingFactor,
  };
  if (typeof leaderboardSize !== "undefined") {
    item.Leaderboard_Size = leaderboardSize;
  } else {
    item.Leaderboard_Size = -1;
  }
  if (typeof period !== "undefined") {
    item.Period = period;
  } else {
    item.Period = -1;
  }
  if (typeof displayName !== "undefined") {
    item.Display_Name = displayName;
  }
  if (typeof description !== "undefined") {
    item.Description = description;
  }
  await db.send(
    new PutCommand({
      TableName: getTableName("boards"),
      Item: item,
    })
  );
}

export async function fetchBoards(
  db: DynamoDBDocumentClient,
  scanOptions?: Omit<ScanCommandInput, "TableName">
) {
  const boards: TableBoard[] = [];
  let result: ScanCommandOutput;
  do {
    result = await db.send(
      new ScanCommand({ TableName: getTableName("boards"), ...scanOptions })
    );
    if (result.Items) {
      boards.push(...(result.Items as TableBoard[]));
    }
  } while (result.LastEvaluatedKey);
  return boards;
}

export async function fetchBoard(
  db: DynamoDBDocumentClient,
  name: string,
  getOptions?: Omit<GetCommandInput, "TableName" | "Key">
) {
  const response = await db.send(
    new GetCommand({
      TableName: getTableName("boards"),
      Key: {
        Name: name,
      },
      ...getOptions,
    })
  );
  if (!response.Item) {
    return null;
  }
  return response.Item as TableBoard;
}
