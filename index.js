const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');/* to connect server to the database */
require('dotenv').config();
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000;

const app = express();

// middleware 
app.use(cors()); /* for providing access to other*/
app.use(express.json()); /* for req.body */


const verifyJwt = (req, res, next) => {
    const authHeader = req.headers.authorization;
    // console.log('inside the function', authHeader)
    if (!authHeader) {
        return res.status(401).send({ message: 'Unauthorized Access' })
    };
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: 'Access Forbidden' })
        };
        console.log('decoded', decoded)
        req.decoded = decoded;
        next();

    })
}


// connect server to the database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5mxuf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// to work with database 
async function run() {
    try {
        await client.connect();
        const serviceCollection = client.db('GeniusCar').collection('Experts');
        const orderCollection = client.db('GeniusCar').collection('orders');

        // authentication (JWT)
        app.post('/login', async (req, res) => {
            const user = req.body;
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '1d'
            });
            res.send({ accessToken });
        });

        // Service Collection API
        // get all service data from database and send to client side
        app.get('/service', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });
        // get single service data with id params from database and send to client side
        app.get('/service/:id', async (req, res) => {
            const idParams = req.params.id;
            const query = { _id: ObjectId(idParams) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });

        // receive new service add request from client side to save in the data base and then send to client side again
        app.post('/service', async (req, res) => {
            const newService = req.body;
            const result = await serviceCollection.insertOne(newService);
            res.send(result);
        });
        // receive delete request from client side to delete from database 
        app.delete('/service/:id', async (req, res) => {
            const idAsParams = req.params.id;
            const query = { _id: ObjectId(idAsParams) };
            const result = await serviceCollection.deleteOne(query);
            res.send(result);
        });

        // order collection API
        app.post('/order', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result);
        });

        app.get('/orders', verifyJwt, async (req, res) => {
            const decodedEmail = req.decoded.email;
            const email = req.query.email;
            if (email === decodedEmail) {
                const query = { email };
                const cursor = orderCollection.find(query);
                const orders = await cursor.toArray();
                res.send(orders);
            }
            else {
                res.status(403).send({ message: 'Forbidden Access' });
            }
        })

    }
    finally {

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Genius Car Server is running')
});

app.listen(port, () => {
    console.log(`Genius Car Server is running at port : ${port}`);
});