import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb"; // ES6 import

export default function () {
  const isTest = process.env.NODE_ENV === "test";
  const config = {
    ...(isTest && {
      endpoint: "http://localhost:8000",
      region: "local-env",
    }),
  };
  const ddb = new DynamoDBClient(config);
  return DynamoDBDocumentClient.from(ddb, {
    marshallOptions: {
      convertEmptyValues: true,
    },
  });
}

export interface TableBoard {
  Name: string;
  Score_Range: number[];
  Branching_Factor: number;
  Period: number;
  Leaderboard_Size: number;
}

export interface TableScores {
  Board_Name: string;
  Player_ID: string;
  Score: number[];
  Date: string;
}

export interface TableNodes {
  Node_ID: string;
  Board_Name: string;
  Child_Counts: number[];
}

export interface TableLeaderboards {
  Board_Name: string;
  Period: number;
  Scores: TableScores[];
}
