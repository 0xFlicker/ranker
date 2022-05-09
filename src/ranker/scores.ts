import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { getTableName } from "../config";
import { TableScores } from "../db/dynamodb";

export interface Scorer {
  fetchScore(playerId: string): Promise<TableScores | null>;
  setScore(
    playerId: string,
    playerScore: { score: number[]; date?: Date | string }
  ): Promise<void>;
}

export function createScorer(
  boardName: string,
  db: DynamoDBDocumentClient
): Scorer {
  return {
    async fetchScore(playerId: string): Promise<TableScores | null> {
      const response = await db.send(
        new GetCommand({
          TableName: getTableName("scores"),
          Key: {
            Player_ID: playerId,
            Board_Name: boardName,
          },
        })
      );
      if (!response.Item) {
        return null;
      }
      return response.Item as TableScores;
    },
    async setScore(
      playerId: string,
      playerScore: { score: number[]; date?: Date | string }
    ): Promise<void> {
      const { score, date } = playerScore;
      let dateString: string;
      if (typeof date === "string") {
        dateString = date;
      } else if (typeof date === "number") {
        dateString = new Date(date).toISOString();
      } else if (date) {
        dateString = date.toISOString();
      } else {
        dateString = new Date().toISOString();
      }
      await db.send(
        new PutCommand({
          TableName: getTableName("scores"),
          Item: {
            Player_ID: playerId,
            Board_Name: boardName,
            Score: score,
            Date: dateString,
          },
        })
      );
    },
  };
}
