//During the test the env variable is set to test
process.env.NODE_ENV = 'test';




//Require the dev-dependencies
let chai = require('chai');
const { expect } = require('chai');
let chaiHttp = require('chai-http');
const { doesNotThrow } = require('should');
const orders = require("../app/controllers/order.controller.js");
let should = chai.should();
let server = require('../server');



chai.use(chaiHttp);
//Our parent block
describe('Orders', () => {
    beforeEach(() => { //Before each test we empty the database
        orders.resetTables({}, (err) => { });
    });
    afterEach(() => { //Before each test we empty the database
        orders.resetTables({}, (err) => { });
    });


    /*
      * Test the /GET  all route
      */
    describe('/GET all orders', () => {
        it('it should GET all the orders', async () => {
            const res = await chai.request(server)
                .get('/api/orders');
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(0);


        });
    });
    /*
    * Test the /POST route
    */
    describe('/POST order', async () => {
        //Test a single book insert 
        it('it should post a correct order', async () => {
            let order = {
                tableNumber: 1,
                itemName: 'Cake',
                deliveryTime: 6

            }
            const res = await chai.request(server)
                .post('/api/orders')
                .send(order);


            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('orderId');
            res.body.should.have.property('tableNumber');
            res.body.should.have.property('itemName');
            res.body.should.have.property('deliveryTime');

            //Check it is seen by a get
            const getRes = await chai.request(server)
                .get('/api/orders');
            getRes.should.have.status(200);
            getRes.body.should.be.a('array');
            getRes.body.length.should.be.eql(1);
            expect(getRes.body[0].itemName).to.equal('Cake');
            expect(getRes.body[0].tableNumber).to.equal(1);



        });
        //Test Incorrect Order formats
        it('it should not post an order with table 0', async () => {
            let badOrder = {
                tableNumber: 0,
                itemName: 'Cake',
                deliveryTime: 6

            }
            const res = await chai.request(server)
                .post('/api/orders')
                .send(badOrder);


            res.should.have.status(500);

            res.body.should.have.property('message')
                .eql('Validation error: Validation min on tableNumber failed');
        });
        it('it should not post an order with table 101 (over max)', async () => {
            let badOrder = {
                tableNumber: 101,
                itemName: 'Cake',
                deliveryTime: 6

            }
            const res = await chai.request(server)
                .post('/api/orders')
                .send(badOrder);


            res.should.have.status(500);
            res.body.should.have.property('message')
                .eql('Validation error: Validation max on tableNumber failed');
        });
        it('it should not post an order with with a null item name', async () => {
            let badOrder = {
                tableNumber: 100,
                itemName: '',
                deliveryTime: 6

            }
            const res = await chai.request(server)
                .post('/api/orders')
                .send(badOrder);


            res.should.have.status(400);
            res.body.should.have.property('message')
                .eql('Item Name cannot be null');
        });
        it('it should not post an order with  a long item name (30 chars)', async () => {
            let badOrder = {
                tableNumber: 100,
                itemName: '0123456789012345678901234567890',
                deliveryTime: 6

            }
            const res = await chai.request(server)
                .post('/api/orders')
                .send(badOrder);


            res.should.have.status(500);
            res.body.should.have.property('message')
                .eql('Validation error: Validation len on itemName failed');
        });
        it('it should not post an order with  a long item name (30 chars)', async () => {
            let badOrder = {
                tableNumber: 100,
                itemName: '0123456789012345678901234567890',
                deliveryTime: 6

            }
            const res = await chai.request(server)
                .post('/api/orders')
                .send(badOrder);


            res.should.have.status(500);
            res.body.should.have.property('message')
                .eql('Validation error: Validation len on itemName failed');
        });
        it('it should not post an order with a delivery time under 5 min', async () => {
            let badOrder = {
                tableNumber: 100,
                itemName: 'cake',
                deliveryTime: 4

            }
            const res = await chai.request(server)
                .post('/api/orders')
                .send(badOrder);


            res.should.have.status(500);
            res.body.should.have.property('message')
                .eql('Validation error: Validation isAfter on deliveryTime failed');
        });
        it('it should not post an order with a delivery time over 15 min', async () => {
            let badOrder = {
                tableNumber: 100,
                itemName: 'cake',
                deliveryTime: 16

            }
            const res = await chai.request(server)
                .post('/api/orders')
                .send(badOrder);


            res.should.have.status(500);
            res.body.should.have.property('message')
                .eql('Validation error: Validation isBefore on deliveryTime failed');
        });
    });

    /*
      * Test the /GET specific item for a table route. 
      */
    describe('/GET order for table by item', () => {
        //Two orders at different tables
        it('it should get matching orders', async () => {
            let order = {
                tableNumber: 1,
                itemName: 'Cake',
                deliveryTime: 6

            }
            const res = await chai.request(server)
                .post('/api/orders')
                .send(order);


            res.should.have.status(200);
            let order2 = {
                tableNumber: 2,
                itemName: 'Cake',
                deliveryTime: 6

            }
            const res2 = await chai.request(server)
                .post('/api/orders')
                .send(order2);


            res2.should.have.status(200);

            const res3 = await chai.request(server)
                .get('/api/orders/cake/tables/1');
            res3.should.have.status(200);
            res3.body.should.be.a('array');
            res3.body[0].should.have.property('orderId');
            res3.body[0].should.have.property('tableNumber').eql(1);
            res3.body[0].should.have.property('itemName').eql('Cake');
            res3.body[0].should.have.property('deliveryTime');
            res3.body.length.should.be.eql(1);

        });
        //Two orders at with the same item and same table
        it('it should get the correct order by table when there are multiples', async () => {
            let order = {
                tableNumber: 1,
                itemName: 'Cake',
                deliveryTime: 6

            }
            const res = await chai.request(server)
                .post('/api/orders')
                .send(order);


            res.should.have.status(200);


            const res2 = await chai.request(server)
                .post('/api/orders')
                .send(order);


            res2.should.have.status(200);

            const res3 = await chai.request(server)
                .get('/api/orders/cake/tables/1');
            res3.should.have.status(200);
            res3.body.should.be.a('array');
            res3.body[0].should.have.property('orderId');
            res3.body[0].should.have.property('tableNumber').eql(1);
            res3.body[0].should.have.property('itemName').eql('Cake');
            res3.body[0].should.have.property('deliveryTime');
            res3.body[1].should.have.property('orderId');
            res3.body[1].should.have.property('tableNumber').eql(1);
            res3.body[1].should.have.property('itemName').eql('Cake');
            res3.body[1].should.have.property('deliveryTime');
            res3.body.length.should.be.eql(2);

        });
        //Two orders of different items
        it('it should get the correct order by item name', async () => {
            let order = {
                tableNumber: 1,
                itemName: 'Cake',
                deliveryTime: 6

            }
            const res = await chai.request(server)
                .post('/api/orders')
                .send(order);


            res.should.have.status(200);
            let order2 = {
                tableNumber: 1,
                itemName: 'Pie',
                deliveryTime: 6

            }
            const res2 = await chai.request(server)
                .post('/api/orders')
                .send(order2);


            res2.should.have.status(200);

            const res3 = await chai.request(server)
                .get('/api/orders/cake/tables/1');
            res3.should.have.status(200);
            res3.body.should.be.a('array');
            res3.body[0].should.have.property('orderId');
            res3.body[0].should.have.property('tableNumber').eql(1);
            res3.body[0].should.have.property('itemName').eql('Cake');
            res3.body[0].should.have.property('deliveryTime');
            res3.body.length.should.be.eql(1);
        });
    });

    /*
      * Test the /GET  all for a table  route
      */
    describe('/GET all orders for table ', () => {
        it('it should GET all the orders at the table', async () => {
            let order = {
                tableNumber: 1,
                itemName: 'Cake',
                deliveryTime: 6

            }
            let order2 = {
                tableNumber: 2,
                itemName: 'Cake',
                deliveryTime: 6

            }
            let res = await chai.request(server)
                .post('/api/orders')
                .send(order);
            res.should.have.status(200);
            res = await chai.request(server)
                .post('/api/orders')
                .send(order);
            res.should.have.status(200);
            res = await chai.request(server)
                .post('/api/orders')
                .send(order2);
            res.should.have.status(200);
            res = await chai.request(server)
                .get('/api/orders/tables/1');
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body[0].should.have.property('orderId');
            res.body[0].should.have.property('tableNumber').eql(1);
            res.body[0].should.have.property('itemName').eql('Cake');
            res.body[0].should.have.property('deliveryTime');
            res.body[1].should.have.property('orderId');
            res.body[1].should.have.property('tableNumber').eql(1);
            res.body[1].should.have.property('itemName').eql('Cake');
            res.body[1].should.have.property('deliveryTime');
            res.body.length.should.be.eql(2);


        });
        it('it should GET no orders at an empty table', async () => {
            let order = {
                tableNumber: 1,
                itemName: 'Cake',
                deliveryTime: 6

            }

            let res = await chai.request(server)
                .post('/api/orders')
                .send(order);
            res.should.have.status(200);
            res = await chai.request(server)
                .get('/api/orders/tables/2');
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(0);


        });
    });
    /*
     * Test the /Delete a single order route
     */
    describe('/DELETE a single order', () => {
        it('it should not delete an order that doesnt match', async () => {
            //Add an order 
            let order = {
                tableNumber: 1,
                itemName: 'Cake',
                deliveryTime: 6

            }
            res = await chai.request(server)
                .post('/api/orders')
                .send(order);

            //Try to remove a different order 
            res2 = await chai.request(server)
                .delete('/api/orders/' + (res.body.orderId + 1) + '/tables/1');
            res2.should.have.status(404);
            res2.body.should.have.property('message')
                .eql('Could not delete order with id=' + (res.body.orderId + 1));
            //Ensure the order is still there
            res3 = await chai.request(server)
                .get('/api/orders');
            res3.should.have.status(200);
            res3.body.should.be.a('array');
            res3.body.length.should.be.eql(1);


        });
        it('it should properly delete an order', async () => {

            //Add an order 
            let order = {
                tableNumber: 1,
                itemName: 'Cake',
                deliveryTime: 6

            }
            res = await chai.request(server)
                .post('/api/orders')
                .send(order);

            //Try to remove a that order 
            res2 = await chai.request(server)
                .delete('/api/orders/' + (res.body.orderId) + '/tables/1');
            res2.should.have.status(200);
            res2.body.should.have.property('message')
                .eql('Order successfully deleted');
            //Ensure the order is removed
            res3 = await chai.request(server)
                .get('/api/orders');
            res3.should.have.status(200);
            res3.body.should.be.a('array');
            res3.body.length.should.be.eql(0);


        });
    });


});



