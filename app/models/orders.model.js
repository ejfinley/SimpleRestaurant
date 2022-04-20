
const { DataTypes } = require("sequelize");
const dbConfig = require("../config/db.config.js");

module.exports = (sequalize, Sequelize) => {
    const Order = sequalize.define("order", {
        orderId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        tableNumber: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate:{
                min: 1,
                max: dbConfig.MAXTABLES,
            }
        },
        itemName:{
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                //Item name must be atlest 3 chars 
                // And no more than 30 chars
                len: [3, 30],
            }
        },
        deliveryTime:{
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                isAfter: new Date(new Date().getTime() + 5 *60000).toISOString(),
                isBefore: new Date(new Date().getTime() + 16 *60000 ).toISOString(),

            }
            
            
        }
    });
    return Order;
};