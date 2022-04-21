const express = require("express");
const cors = require("cors");
const db = require ("./app/models");
const app = express();



//Allow cross orgin request from 8080
// Its not necessary now but would need to approve needed orgind
var corsOptions = {
    origin: "http://localhost:8080" 
};
app.use(cors(corsOptions));
// Expect request as json 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



db.sequalize.sync();

//Base route with some usage info
app.get("/", (req, res) => {
    res.json({message: 'Available routes: \n HTTP call : Route : { Body fields} = response \n' +
        'GET : /api/orders : {} : Returns all orders ' +
        'POST : /api/orders : {itemName : Name of the food between 3-30 chars, tableNumber : Table for the order between 1-100 , deliveryTime : time the order takes to prepare between 5 - 15} : Adds the order to th database returns a copy' +
        'GET : /api/orders/:itemName/tables/:tableNumber : {} : Returns all orders at the specified table with a itemName like the one specified' +
        'GET : /api/orders/tables/:tableNumber : {} : Returns all orders for specified table ' +
        'DELETE : /api/orders/:id/tables/:tableNumber : {} : Deletes the order with matching ID and Table number  ' +
        'DELETE : /api/orders : {} : Purges all orders past their delivery time this could be changed to return a list so clients know which orders are done '
    });
});
require("./app/routes/order.routes")(app);
const PORT = 8080;
module.exports = app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})


