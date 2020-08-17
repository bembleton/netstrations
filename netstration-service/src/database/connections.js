const aws = require('aws-sdk'); 

const dynamoDb = new aws.DynamoDB.DocumentClient();
const TableName = process.env.CONNECTIONS_TABLE;

export const addConnection = async (connection) => {
  const { connectionId } = connection;

  const connectionInfo = {
    TableName,
    Item: connection,
    ConditionExpression: 'attribute_not_exists(connectionId)'
  };

  try {
    await dynamoDb.put(connectionInfo).promise();
    console.log(`Registered connection: ${connectionId}`, connection);

  } catch (err) {
    console.log(`Failed to register connection: ${connectionId}`, { connection, err: err.message });
  }
};

export const getRoomCode = async (connectionId) => {
  try {
    const params = {
      TableName,
      Key: { connectionId }
    };

    const result = await dynamoDb.get(params).promise();
    if (!result || !result.Item) return null;
    const { Item: { room_code } } = result;
    return room_code;

  } catch (err) {
    console.log(`Connection not found: ${connectionId}`, { err: err.message });
    return null;
  }
};

export const removeConnection = async (connectionId) => {
  try {
    const params = {
      TableName,
      Key: { connectionId }
    };

    await dynamoDb.delete(params).promise();

  } catch (err) {
    console.log(`Failed to remove connection: ${connectionId}`, { err: err.message });
  }
};
