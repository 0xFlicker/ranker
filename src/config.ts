export interface IConfig {
  readonly tableNames: {
    boards: string;
    scores: string;
    nodes: string;
    leaderboards: string;
    nonces: string;
  };
}

export function getTableName(tableName: keyof IConfig["tableNames"]): string {
  return (
    process.env[`TABLE_NAME_RANKER_${tableName.toUpperCase()}`] ||
    config.tableNames[tableName]
  );
}

export const config: IConfig = {
  tableNames: {
    boards: "boards",
    scores: "scores",
    nodes: "nodes",
    leaderboards: "leaderboards",
    nonces: "nonces",
  },
};
