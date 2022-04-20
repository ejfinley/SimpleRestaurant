const express = require("express");
const cors = require("cors");
const db = require ("./app/models");
const app = express();




var corsOptions = {
    origin: "http://localhost:8081" 
};
app.use(cors(corsOptions));
// Expect request as json 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



db.sequalize.sync();

//Base route with some usage info
app.get("/", (req, res) => {
    res.json({message: "TODO provide information on routes."});
});
require("./app/routes/order.routes")(app);
const PORT = 8080;
module.exports = app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})


