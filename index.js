const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

// middleware

app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lxtvnq3.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    const collegesCollection = client.db('collegeDB').collection('colleges');
    const studentsCollection = client.db('collegeDB').collection('students');
    const ratingCollection = client.db('collegeDB').collection('rating');


    // get colleges

    app.get('/colleges', async (req, res) => {
      const result = await collegesCollection.find().toArray();
      res.send(result);
    })

    app.get('/college/:id', async (req, res) => {
      console.log('id', req.params.id);
      const college = await collegesCollection.findOne({ _id: parseInt(req.params.id) });
      console.log(college);
      res.send(college);



      //  app.get("/singleToy/:id", async (req, res) => {
      //             console.log(req.params.id);
      //             const toy = await toysCollection.findOne({
      //                 _id: new ObjectId(req.params.id),
      //             });
      //             res.send(toy);
      //         });

    });

    // student form
    app.post('/students', async (req, res) => {
      const student = req.body;
      console.log('student', student);
      const result = await studentsCollection.insertOne(student);
      res.send(result);
    });

    // get my college by email id 
    app.get('/mycollege/:email', async(req, res) => {
      const email = req.params.email;
      
      const result = await studentsCollection.find({email}).toArray();
      res.send(result);
    });

    // post Rating value

    app.post('/rating', async(req, res) => {
         const rating = req.body;
         console.log('Rating Value',rating);
         const result = await ratingCollection.insertOne(rating);
         res.send(result);
    })

    // get rating value

    app.get('/rating', async (req, res) => {
      const limit = 5; // Set the number of ratings you want to retrieve
      const result = await ratingCollection.find()
        .sort({ createdAt: 1 }) // Sorting by createdAt field in descending order
        .limit(limit)
        .toArray();
    
      res.send(result);
    });








    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('college server is running');
})

app.listen(port, () => {
  console.log(`College is running on port ${port}`);
})