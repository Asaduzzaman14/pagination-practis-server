const express = require('express');
const cors = require('cors')
// require('dovenv').config()
const app = express()
const { MongoClient, ServerApiVersion } = require('mongodb');

const port = process.env.PORT || 5000



app.use(cors())
app.use(express.json())



const uri = "mongodb+srv://dashboard:wtMNv1IJkVX36weW@cluster0.dci89.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect()
        const productCollection = client.db('cs').collection('product')

        app.post('/product', async (req, res) => {
            const product = req.body
            if (!product.name || !product.price) {
                return res.send({ success: false, error: 'please prvide all informaition' });
            }
            const result = await productCollection.insertOne(product)
            res.send({ success: true, message: 'successfully inserted' })

        })

        app.get('/products', async (req, res) => {
            const page = Number(req.query.page)
            const limit = Number(req.query.limit)

            const cursor = productCollection.find()
            const products = await cursor.skip(page * limit).limit(limit).toArray()

            const count = await productCollection.estimatedDocumentCount()
            if (!products.length) {
                return res.send({ success: false, message: 'No product Found' })
            }
            res.send({ success: true, data: products, count: count })

        })


    }
    finally {
    }


}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('hello This is server')
})

app.listen(port, () => {
    console.log('port is runing', port);
})