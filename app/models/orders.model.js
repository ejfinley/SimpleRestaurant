
const { DataTypes } = require("sequelize");
const dbConfig = require("../config/db.config.js");

function toTime(min) {
    return new Date(new Date().getTime() + min * 60000).toISOString()
}

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
            validate: {
                min: 1,
                max: dbConfig.MAXTABLES,
            }
        },
        itemName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                //Item name must be atlest 3 chars 
                // And no more than 30 chars
                len: [3, 30],
            }
        },
        deliveryTime: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                //Check delivery date is between 5-15 min
                dateValidation(deliveryTime) {
                    if(deliveryTime < new Date(new Date().getTime() + 5 * 60000)){
                            throw new Error('Validation isAfter on deliveryTime failed');
                    }
                    if(deliveryTime > new Date(new Date().getTime() + 15 * 60000)){
                        throw new Error('Validation isBefore on deliveryTime failed');
                }
                    
                }

            }


        }
    });
    return Order;
};