const aws = require('aws-sdk'); 

const dynamoDb = new aws.DynamoDB.DocumentClient();
const TableName = process.env.ROOMS_TABLE;

const room_code_chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const room_code_length = 4;

const getRandomRoomCode = () => {
  let room_code = '';
  for (let i=0;i<room_code_length;i++) {
    room_code += room_code_chars[Math.floor(Math.random() * room_code_chars.length)];
  }
  return room_code;
};

export const createRoom = async () => {
  for (let i=0; i<5; i++) {
    const room_code = getRandomRoomCode();

    const room = {
      room_code,
      locked: false,
      players: []
    };
  
    const roomInfo = {
      TableName,
      Item: room,
      ConditionExpression: 'attribute_not_exists(room_code)'
    };
  
    try {
      await dynamoDb.put(roomInfo).promise();
      console.log(`Created room: ${room_code}`);
      return room;

    } catch (err) {
      console.log(`Room not available: ${room_code}`, { roomInfo, err: err.message });
    }
  }

  throw new Error(`Unable to create a room`);
};

/** returns { room_code, locked, players } */
export const getRoom = async (room_code) => {
  const params = {
    TableName,
    Key: { room_code }
  };

  try {
    const { Item: room } = await dynamoDb.get(params).promise();
    return room;

  } catch {
    console.log(`Room not found: ${room_code}`);
    return null;
  }
};

export const updateRoom = async (room) => {
  const { room_code } = room;

  const roomInfo = {
    TableName,
    Item: room
  };

  try {
    await dynamoDb.put(roomInfo).promise();
    return room;

  } catch (err) {
    console.log(`Room update failed: ${room_code}`, { roomInfo, err: err.message });
  }
};
