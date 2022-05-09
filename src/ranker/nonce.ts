import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { getTableName } from "../config";

export async function boardNonce(
  boardName: string,
  db: DynamoDBDocumentClient
): Promise<number> {
  const nonceTableName = getTableName("nonces");
  const response = await db.send(
    new GetCommand({
      TableName: nonceTableName,
      Key: {
        Board_Name: boardName,
      },
    })
  );
  if (!response.Item) {
    await db.send(
      new PutCommand({
        TableName: nonceTableName,
        Item: {
          Board_Name: boardName,
          Nonce: 0,
        },
      })
    );
    return 0;
  }
  const nonce = response.Item.Nonce;
  await db.send(
    new UpdateCommand({
      TableName: nonceTableName,
      Key: {
        Board_Name: boardName,
      },
      UpdateExpression: "set Nonce = Nonce + :inc",
      ExpressionAttributeValues: {
        ":inc": 1,
      },
    })
  );
  return nonce + 1;
}

export async function checkNonce(
  boardName: string,
  nonce: number,
  db: DynamoDBDocumentClient
): Promise<boolean> {
  const nonceTableName = getTableName("nonces");
  const response = await db.send(
    new GetCommand({
      TableName: nonceTableName,
      Key: {
        Board_Name: boardName,
      },
    })
  );
  if (!response.Item) {
    return false;
  }
  const storedNonce = response.Item.Nonce;
  return nonce === storedNonce;
}
