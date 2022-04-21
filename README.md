# SimpleResturant

A back end api for for managing orders in a resturant. Developed using, NodeJS, Sequalize, Express. Testing is done using Chai.

# Install Directions

  1. Install MySQl, Node, and Postman
      1. Node https://nodejs.org/en/download/ 
      2. MySQL https://www.mysql.com/products/workbench/
      3. Postman https://www.postman.com/downloads/
  2. MySQL setup
      1. Create a mysql instance on port 3306
      2. For testing root credentials are username : root and Password : password
      3. Create a schema called simpleresturant
  3. Code setup
      1. Pull the code from this repository 
      2. In a terminal run 
          'npm install' to install dependancies
          'npm start' to run the server
          'npm test' runs the chai tests
         
# API routes
  1.After starting some basic route info is on http://localhost:8080/
  2. GET : http://localhost:8080/api/orders : Returns all orders in the database
  3. GET : http://localhost:8080/api/orders/:itemName/tables/:tableNumber Gets all orders with a similar name for defined table
  4. GET : http://localhost:8080/api/orders/tables/:tableNumber Gets all orders for defined table
  5. POST : http://localhost:8080/api/orders passed in form body ar itemName, tableNumber, deliveryTime
  6. DELETE : http://localhost:8080/api/orders/ Deletes all orders where the delivery time is in the past
  7. http://localhost:8080/api/orders/:orderId/tables/:tableNumber Deletes the order with the matching id and table number'
# Field info
  1. tableNumber : Int between 1-100
  2. itemName : String with length 3-30
  3. deliveryTime : Int 5-15 Converted to a date on the backend
# Example order in database
{
        "orderId": 193,
        "tableNumber": 1,
        "itemName": "Cake",
        "deliveryTime": "2022-04-20T07:51:12.000Z",
        "createdAt": "2022-04-20T07:36:12.000Z",
        "updatedAt": "2022-04-20T07:36:12.000Z"
}
# Testing 'npm test' runs the chai test suite there are two notable exceptions
  1. A load test is not run in chai due to how threading works in node. Collection runner in postman can be used for load test
     Ideally this would be done via a script in the future.
  2. The purge route is also not tested. This is due to it taking atleast five minutes which would slow down testing significantly.   
 
  
  
  
     
