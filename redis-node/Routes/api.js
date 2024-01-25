let express = require('express');
let Route = express();
let redis = require('../Controllers/RedisController');

// return instructions
Route.get('/', (req, res) => {
  res.send('Node-Redis CRUD Application | check Readme for instructions');
});

// get all users
Route.get('/products', redis.get_all_products);

// add a new user
Route.post('/product/add', redis.add_product);

// delete a user
Route.delete('/product/delete/:id', redis.delete_product);

// get a user by id
Route.get('/product/:id', redis.get_product);

// update a user by id
Route.put('/product/update/:id', redis.update_product);

module.exports = Route;
