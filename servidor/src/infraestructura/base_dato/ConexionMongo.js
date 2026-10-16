import { MongoClient } from "mongodb";

const cliente = new MongoClient(
    process.env.MONGO_URL,
    {
        maxPoolSize: 5,
        minPoolSize: 2,
        maxIdleTimeMS: 30000,
        waitQueueTimeoutMS: 3000
    }
);

await cliente.connect();

export const conexionMongo =
    cliente.db("programacion_web");