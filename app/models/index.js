const mysql = require("mysql2");
const dbConfig = require("../config/db.config.js");
const Sequelize = require("Sequelize")
//Load in mysql info
const sequelize = new Sequelize(dbConfig.DB, 
    dbConfig.USERNAME, 
    dbConfig.PASSWORD,
    {
        host: dbConfig.HOST,
        dialect: dbConfig.DIALECT,
        port : dbConfig.PORT,
        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle
        }

    }
);

const db = {};
db.Sequelize = Sequelize;
db.sequalize = sequelize;
//Require our models for the database
db.orders = require("./orders.model.js")(sequelize, Sequelize);


//Create tables if none exists
// Open the connection to MySQL server
const connection = mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USERNAME,
    password: dbConfig.PASSWORD,
});

module.exports = db;

connection.query(
    `CREATE DATABASE IF NOT EXISTS simpleresturant`,
    function (err, results) {
    //   console.log(results);
    //   console.log(err);
    }
    
);
// Close the connection
connection.end();