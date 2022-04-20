module.exports = app => {
    const orders = require("../controllers/order.controller.js");
    var router = require("express").Router();

    router.post("/", orders.create);

    router.get("/", orders.getAll);
    router.get("/:itemName/tables/:tableNumber", orders.getByNameForTable);
    router.get("/tables/:tableNumber", orders.getByTable);
    router.delete("/:id/tables/:tableNumber", orders.delete);
    router.delete("/", orders.purge);
    app.use('/api/orders', router);
};