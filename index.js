const express = require("express");
// const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;




const uri =` mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oyinl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const port = 5000;
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req,res) =>{
  res.send("Hello World");
});

client.connect(err => {
    client.connect();
    console.log("database connected successfully");
    const database = client.db('travelUser');
   
    /* places collection */
    const servicesCollection = database.collection('services');
    const ordersCollection = database.collection('orders');

    // get places api //
    app.get('/services', async (req, res) => {
        const cursor = servicesCollection.find({});
        const services = await cursor.toArray();
        res.send(services);
    });

        //post order data api //
      app.post('/orders', async(req, res) =>{
          const order = req.body;

          const result = await ordersCollection.insertOne(order);
          console.log(`A document was inserted with the _id: ${result.insertedId}`);
          res.json(result)
      });
    
           // get orders api //
      app.get('/orders', async (req, res) => {
        const cursor = ordersCollection.find({});
        const orders = await cursor.toArray();
        res.send(orders);
    });

     // add Events
  app.post("/services", async (req, res) => {
    console.log(req.body);
    const result = await servicesCollection.insertOne(req.body);
    console.log(result);
  });

    
  });


  app.listen(process.env.PORT || port);
