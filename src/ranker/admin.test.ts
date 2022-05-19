import { v4 as createUuid } from "uuid";
import createDb from "../db/dynamodb";
import { createRanker, fetchBoard, fetchBoards } from "./admin";

describe("#admin", () => {
  it("can create a ranker", async () => {
    const rootKey = createUuid();
    const db = createDb();
    await createRanker({
      db,
      rootKey,
      scoreRange: [0, 1, 2, 3, 4, 5],
      branchingFactor: 2,
      leaderboardSize: 10,
      period: 10,
      displayName: "Test",
      description: "Test",
    });
    const board = await fetchBoard(db, rootKey, {
      ConsistentRead: true,
    });
    expect(board).toMatchObject({
      Name: rootKey,
      Score_Range: [0, 1, 2, 3, 4, 5],
      Branching_Factor: 2,
      Leaderboard_Size: 10,
      Period: 10,
      Display_Name: "Test",
      Description: "Test",
    });
  });

  it("leaderboard size is -1 if not provided", async () => {
    const rootKey = createUuid();
    const db = createDb();
    await createRanker({
      db,
      rootKey,
      scoreRange: [0, 1, 2, 3, 4, 5],
      branchingFactor: 2,
    });
    const board = await fetchBoard(db, rootKey, {
      ConsistentRead: true,
    });
    expect(board).toMatchObject({
      Name: rootKey,
      Score_Range: [0, 1, 2, 3, 4, 5],
      Branching_Factor: 2,
      Leaderboard_Size: -1,
    });
  });

  it("Period size is -1 if not provided", async () => {
    const rootKey = createUuid();
    const db = createDb();
    await createRanker({
      db,
      rootKey,
      scoreRange: [0, 1, 2, 3, 4, 5],
      branchingFactor: 2,
    });
    const board = await fetchBoard(db, rootKey, {
      ConsistentRead: true,
    });
    expect(board).toMatchObject({
      Name: rootKey,
      Score_Range: [0, 1, 2, 3, 4, 5],
      Branching_Factor: 2,
      Period: -1,
    });
  });

  it("Can get multiple boards", async () => {
    const boards = await fetchBoards(createDb(), {
      ConsistentRead: true,
    });
    expect(boards.length).toBeGreaterThan(1);
  });
});
