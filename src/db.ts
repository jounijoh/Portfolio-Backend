
const { MongoClient, ServerApiVersion } = require('mongodb');

import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI


const client = new MongoClient(uri, {
  monitorCommands: true,
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,

  }
});

client.on('commandStarted', (event: any) => console.debug(event));
client.on('commandSucceeded', (event: any) => console.debug(event));
client.on('commandFailed', (event: any) => console.debug(event));

async function connectToDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
  }
}


export { client, connectToDB };