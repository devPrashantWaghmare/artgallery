import { MongoClient } from 'mongodb';

// Environment variables
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
}

if (!MONGODB_DB) {
    throw new Error('Please define the DB_NAME environment variable');
}

// Global cache to reuse MongoDB client and avoid multiple connections
let cachedClient = global.mongoClient;
let cachedDb = global.mongoDb;

if (!cachedClient) {
    cachedClient = global.mongoClient = null;
    cachedDb = global.mongoDb = null;
}

export async function dbConnect() {
    if (cachedClient && cachedDb) {
        return { db: cachedDb, client: cachedClient };
    }

    try {
        const client = new MongoClient(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        await client.connect();
        const db = client.db(MONGODB_DB);

        // Cache the client and database
        cachedClient = global.mongoClient = client;
        cachedDb = global.mongoDb = db;

        return { db, client };
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw new Error('Failed to connect to MongoDB');
    }
}

export default dbConnect;
