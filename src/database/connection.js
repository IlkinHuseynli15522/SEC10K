import mysql from "mysql2/promise";

const dbSettings = {
    host: "212.109.198.35",
    user: "emil", 
    password: "Emil123!", 
    database: "sec10k" ,
};

export const getConnection = async () => {
    try {
        const pool = await mysql.createPool(dbSettings);
        return pool;
    } catch (error) {
        console.error("Database connection error:", error);
    }
};