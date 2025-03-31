const { MongoClient, ServerApiVersion } = require('mongodb');

const mongoose = require('mongoose');

const uri = process.env.DB_URI;

const client = new MongoClient(uri);

const dbName = "Clustor0"; // Replace with your actual database name


async function connectToDatabase() {
    await client.connect();
    console.log("Connected to MongoDB");
    return client.db(dbName);
}

// Ensure the `users` collection exists with proper indexes
async function ensureUsersCollection(collectionName) {
    const db = await connectToDatabase();
    const collections = await db.listCollections({ name: collectionName }).toArray();

    if (collections.length === 0) {
        await db.createCollection(collectionName);
        console.log("Created 'users' collection");
        
        // Create an index on the email field to enforce uniqueness
        await db.collection(collectionName).createIndex({ email: 1 }, { unique: true });
        console.log("Created index on email field");
    }
}

async function insertUser(collectionName,user) {
    const db = await connectToDatabase();
    user.createdAt = new Date();
    user.updatedAt = new Date();
    return db.collection(collectionName).insertOne(user);
}

async function findUserByEmail(collectionName,email) {
    const db = await connectToDatabase();
    return db.collection(collectionName).findOne({ email });
}

async function updateUser(collectionName, email, updatedData) {
    const db = await connectToDatabase();
    updatedData.updatedAt = new Date();
    return db.collection(collectionName).updateOne({ email }, { $set: updatedData });
}

async function closeDatabase() {
    await client.close();
}

module.exports = { ensureUsersCollection, insertUser, findUserByEmail, updateUser, closeDatabase };
