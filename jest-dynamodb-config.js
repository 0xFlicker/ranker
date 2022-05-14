module.exports = {
  tables: [
    {
      TableName: `boards`,
      KeySchema: [{ AttributeName: "Name", KeyType: "HASH" }],
      AttributeDefinitions: [{ AttributeName: "Name", AttributeType: "S" }],
      BillingMode: "PAY_PER_REQUEST",
    },
    {
      TableName: `scores`,
      KeySchema: [
        { AttributeName: "Board_Name", KeyType: "HASH" },
        { AttributeName: "Player_ID", KeyType: "RANGE" },
      ],
      AttributeDefinitions: [
        { AttributeName: "Board_Name", AttributeType: "S" },
        { AttributeName: "Player_ID", AttributeType: "S" },
      ],
      BillingMode: "PAY_PER_REQUEST",
    },
    {
      TableName: `nodes`,
      KeySchema: [
        { AttributeName: "Board_Name", KeyType: "HASH" },
        { AttributeName: "Node_ID", KeyType: "RANGE" },
      ],
      AttributeDefinitions: [
        { AttributeName: "Node_ID", AttributeType: "S" },
        { AttributeName: "Board_Name", AttributeType: "S" },
      ],
      BillingMode: "PAY_PER_REQUEST",
    },
    {
      TableName: `leaderboards`,
      KeySchema: [{ AttributeName: "Board_Name", KeyType: "HASH" }],
      AttributeDefinitions: [
        { AttributeName: "Board_Name", AttributeType: "S" },
      ],
      BillingMode: "PAY_PER_REQUEST",
    },
  ],
  port: 8000,
};
