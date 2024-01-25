let redis = require('redis'); // Require Redis
let client = redis.createClient(); // Create a new redis instance

exports.get_all_products = (req, res, next) => {
  let return_dataset = [];

  client.keys('*', (err, id) => {
    let multi = client.multi();
    let keys = Object.keys(id);
    let i = 0;

    keys.forEach((l) => {
      client.hgetall(id[l], (e, o) => {
        i++;
        if (e) {
          console.log(e);
        } else {
          temp_data = { id: id[l], data: o };
          return_dataset.push(temp_data);
        }

        if (i == keys.length) {
          res.send({ products: return_dataset });
        }
      });
    });
  });
};

exports.add_product = (req, res, next) => {
  // post Parameters
  let id = req.body.id;
  let product_name = req.body.product_name;
  let description = req.body.description;
  let price = req.body.price;
  let stock = req.body.stock;

  // make id the key and assign the id to the other Parameters
  client.hmset(
    id,
    [
      'product_name',
      product_name,
      'description',
      description,
      'price',
      price,
      'stock',
      stock,
    ],
    (err, reply) => {
      if (err) {
        console.log(err); // callback to log errors
      }

      console.log(reply); // log success message
      res.send('Product added successfully'); // response back to the client
    }
  );
};

exports.delete_product = (req, res, next) => {
  // find key associated with the id and deletes it
  client.del(req.params.id, (err, reply) => {
    if (err) {
      console.log(err); // callback incase something goes wrong
    }

    console.log(reply); // log success message
    res.send('User deleted successfully'); // response back to the client
  });
};

exports.get_product = (req, res, next) => {
  // id from url Parameter
  let id = req.params.id;

  // get all values associated with the key as id
  client.hgetall(id, (err, obj) => {
    if (!obj) {
      res.send('Product does not exist'); // if no user is associated with that id/key return this
    } else {
      obj.id = id;

      res.send({
        product: obj, // if user is found return details
      });
    }
  });
};

exports.update_product = (req, res, next) => {
  // put Parameters
  let id = req.params.id;
  let product_name = req.body.product_name;
  let description = req.body.description;
  let price = req.body.price;
  let stock = req.body.stock;

  // make id the key and assign the id to the other Parameters
  client.hmset(
    id,
    [
      'product_name',
      product_name,
      'description',
      description,
      'price',
      price,
      'stock',
      stock,
    ],
    (err, reply) => {
      if (err) {
        console.log(err); // callback to log errors
      }

      console.log(reply); // log success message
      res.send('Product updated successfully'); // response to client
    }
  );
};
