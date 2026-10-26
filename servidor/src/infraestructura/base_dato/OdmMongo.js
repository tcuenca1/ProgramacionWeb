import mongoose from "mongoose";

export const odmMongo = mongoose.createConnection(
    process.env.MONGO_URL,
    {
        maxPoolSize: 5,
        minPoolSize: 2,
        maxIdleTimeMS: 30000
    }
);
