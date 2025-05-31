require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.tbuverl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    // Coffees informaiton

    // const database = client.db("usersDb");
    // const usercollection = database.collection("users");
    const database = client.db("coffeedb");
    const usercollection = database.collection("coffees");
    // get data

    app.get("/coffees", async (req, res) => {
      const cursor = usercollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usercollection.findOne(query);
      res.send(result);
    });

    const defaultCoffees = [
      {
        photo: "https://i.postimg.cc/FsqN0gdL/4.png",
        name: "Espresso",
        chef: "John Barista",
        price: 45,
      },
      {
        photo: "https://i.postimg.cc/9FfQdQLv/3.png",
        name: "Latte",
        chef: "Anna Brew",
        price: 50,
      },
      {
        photo: "https://i.postimg.cc/sX9gcQdR/1.png",
        name: "Cappuccino",
        chef: "Chris Roast",
        price: 52.5,
      },
      {
        photo: "https://i.postimg.cc/NFsfPsB2/2.png",
        name: "Americano",
        chef: "Emily Beans",
        price: 40,
      },
      {
        photo: "https://i.postimg.cc/13qPBnwY/5.png",
        name: "Macchiato",
        chef: "Liam Cream",
        price: 57.5,
      },
      {
        photo: "https://i.postimg.cc/43vGCD86/6.png",
        name: "Mocha",
        chef: "Sophia Milk",
        price: 60,
      },
    ];
    // if the database is empty that time it will put the default data
    const insertDefaultData = async () => {
      await client.connect();
      const count = await usercollection.countDocuments();
      if (count === 0) {
        await usercollection.insertMany(defaultCoffees);
        console.log("Default coffee data inserted.");
      } else {
        console.log("Default coffee data already exists.");
      }
    };

    insertDefaultData().catch(console.error);

    // post data
    app.post("/coffees", async (req, res) => {
      console.log("data posted", req.body);
      const newuser = req.body;
      const result = await usercollection.insertOne(newuser);
      res.send(result);
    });

    app.delete("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usercollection.deleteOne(query);
      res.send(result);
    });

    app.put("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const coffee = req.body;
      const update = {
        $set: {
          name: coffee.name,
          chef: coffee.chef,
          supplier: coffee.supplier,
          taste: coffee.taste,
          category: coffee.category,
          details: coffee.details,
          photo: coffee.photo,
          price: coffee.price,
        },
      };

      const option = { upset: true };
      const result = await usercollection.updateOne(filter, update, option);
      res.send(result);
    });

    // user information

    const database_user = client.db("userdb");
    const usercollection1 = database_user.collection("users");

    app.get("/users", async (req, res) => {
      const cursor = usercollection1.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usercollection1.findOne(query);
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      console.log("data posted", req.body);
      const newuser = req.body;

      // Check if a user with the same name already exists
      const existingUser = await usercollection1.findOne({
        name: newuser.name,
      });

      if (existingUser) {
        // User with the same name already exists
        return res
          .status(400)
          .json({ message: "User with this name already exists." });
      }

      // Insert the new user since it's unique
      const result = await usercollection1.insertOne(newuser);
      res.status(201).send(result);
    });

    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usercollection1.deleteOne(query);
      res.send(result);
    });

    app.put("/users/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const user = req.body;
      const update = {
        $set: {
          name: user.name,
          phone: user.phone,
          photo: user.photo,
          address: user.address,
        },
      };

      const option = { upset: true };
      const result = await usercollection1.updateOne(filter, update, option);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// pass- VkVrFgAZxtEsA5I9  simpleDbUser

app.get("/", (req, res) => {
  res.send("user server is running100");
});

app.listen(port, () => {
  console.log(`running server in ${port} port`);
});
