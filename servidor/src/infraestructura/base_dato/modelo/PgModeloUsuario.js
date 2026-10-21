import {DataTypes} from "sequelize";
import {ormPostgres } from "../OrmPostgresql.js";
export const usuarioModelo = ormPostgres.define(
    "Usuario",
    { 
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre:{
            type: DataTypes.STRING,
            allowNull: false
        },
        contrasena:{
            type: DataTypes.STRING,
            allowNull: false
        }, 
        tipo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        ciudad: {
            type: DataTypes.STRING
        },
        telefono: {
            type: DataTypes.STRING
        },
    },
    {
        tableName:"usuario",
        timestamps: false
    }
);