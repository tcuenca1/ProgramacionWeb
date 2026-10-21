import {Sequelize} from "sequelize";
export const ormPostgres = new Sequelize(
    process.env.POSTGRES_DB,
    process.env.POSTGRES_USER,
    process.env.POSTGRES_PASSWORD,
    {
        host: process.env.POSTGRES_HOST,
        port: 5432,
        dialect: "postgres",
        logging: console.log,
        pool:{
            max:5,
            min:0,
            acquire: 30000,
            idle: 10000
        }
    } 
);