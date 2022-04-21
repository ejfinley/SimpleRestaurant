const db = require("../models");
const Order = db.orders;
const { Op } = require("sequelize");
const { Sequelize } = require("../models");


/*
 * Create an order 
 * expects 
 * int tableNumber 1-100
 * int deliveryTime 5-15
 * String itemName len 3- 30
 * in form body 
 **/
exports.create = (req, res)=> {
    if(!req.body.itemName) {
        res.status(400).send({
            message: "Item Name cannot be null"
        });
        return;
    }
    var date = new Date();
    const deliveryDate = new Date(date.getTime() + req.body.deliveryTime*60000).toISOString();

    

    const order ={
        tableNumber : req.body.tableNumber,
        itemName : req.body.itemName,
        deliveryTime : deliveryDate,


    }
    Order.create(order).then (data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message : err.message
        });
    });

};

/*
 * Returns all Orders 
 **/
exports.getAll = (req, res)=> {
    Order.findAll().then(data => {
        res.send(data);
    })  .catch(err => {
    res.status(500)
        .send({
            message: err.message 
        });
    });
};
/*
 * Returns all Orders at a table with a like name
 * passed as params
 **/
exports.getByNameForTable= (req, res)=> {
    const itemName = req.params.itemName;
    const table = req.params.tableNumber;
    Order.findAll({
            where : {
                itemName : {
                    [Op.like]: '%'+ itemName + '%'
                },    
                tableNumber: table
            }
        }).then(data =>{
        if(data){
            res.send(data);
        } else {
            res.status(404).send({
                message : `No Order with name = ${itemName} for table = ${table}`
            });
        }
    }).catch(err => {
        res.status(500).send({
            message : `Error getting order with name = ${itemName} for table = ${table}`
        });
    });
};
/*
 * Returns all Orders at a table
 * passed as params
 **/
exports.getByTable = (req, res)=> {
    const table = req.params.tableNumber;

    Order.findAll({where : {tableNumber : table}}).then(data => {
        res.send(data);
    })  .catch(err => {
    res.status(500)
        .send({
            message: err.message 
        });
    });

};
/*
 * Deletes an order by id and tableNumber
 * passed as params
 **/
exports.delete = (req, res)=> {
    const id = req.params.id;
    const tableNumber = req.params.tableNumber;
    Order.destroy({
        where : {
            orderId: id,
            tableNumber: tableNumber}
    }).then(num =>{
        if(num >= 1){
            res.send({
                message: "Order successfully deleted"
            });
        } else {
            res.status(404).send({
                message : `Could not delete order with id=${id}`
            });
        }
    }).catch(err =>{
        res.status(500).send({
            message : `Could not delete order with id=${id}`
        });
    });
};

/*
 * Deletes all orders where delivery time has expired
 * This should be changed more to meet client needs
 **/
exports.purge = (req, res)=> {
    Order.destroy({
        where : {deliveryTime:{
            [Op.lt] : Date.now()
        }}
    }).then(num =>{
        if(num == 1){
            res.send({
                message: "Orders successfully purged"
            });
        } else {
            res.send({
                message : `No Orders purged`
            });
        }
    }).catch(err =>{
        res.status(500).send({
            message : `Error purging orders ${err.message}`
        });
    });


};
/*
 * Drops all orders
 * This isnt used by the api 
 * It is just a helper for testing
 **/
exports.resetTables = (req, res)=> {
    Order.destroy({where : {}}).then(num =>{
        if(num == 1){
            res.send({
                message: "Orders successfully deleted"
            });
        } else {
            res.send({
                message : `No Orders deleted`
            });
        }
    }).catch(err =>{
        res.status(500).send({
            message : `Error reseting orders ${err.message}`
        });
    });


};