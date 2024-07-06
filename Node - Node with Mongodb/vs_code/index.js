const libHttp = require('http');
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const util = require("./util");
const libExpress = require('express')

const app = libExpress();
app.use(libExpress.json()); 
// mongo db connection create-----------------------------------------------------------------------------------------------
util.getDbConnection(async(db)=> {
    if (!db) {
        console.error("Failed to connect to the database.");
    } else {
        console.log("Connected to the database successfully.");
    }
        // Create collections 
        try {
            await util.createCollections(db);
        } catch (error) {
            console.error('Error creating collections', error);
        }
});



//----Q5-------product collections and sort in ascending order-------------
app.get('/Product', async(req, res)=>{
    util.getDbConnection(async(db)=>{

        if (!db) {
            return res.status(500).json({ error: "Failed to connect to the database." });
        }
        try {
            const products = await db.collection('products').find().sort({ name: 1 }).toArray();
            res.json(products);
        } catch (error) {
            console.error('Error retrieving products:', error);
            res.status(500).json({ error: 'Error retrieving products.' });
        }
    })
   
})

// Update product price
app.put('/Product/:id', async (req, res) => {
    util.getDbConnection(async (db) => {
        if (!db) {
            return res.status(500).json({ error: "Failed to connect to the database." });
        }

        const productId = req.params.id;
        const newPrice = req.body.price;

        if (!newPrice) {
            return res.status(400).json({ error: 'Price is required.' });
        }

        try {
            const result = await db.collection('products').updateOne(
                { _id: new MongoClient.ObjectId(productId) },
                { $set: { price: newPrice } }
            );

            if (result.matchedCount === 0) {
                return res.status(404).json({ error: 'Product not found.' });
            }

            res.json({ message: 'Product price updated successfully.' });
        } catch (error) {
            console.error('Error of your updating product price:', error);
            res.status(500).json({ error: 'Error updating product price.' });
        }
    });
});

// Delete a collection
app.delete('/collection/:products', async (req, res) => {
    util.getDbConnection(async (db) => {
        if (!db) {
            return res.status(500).json({ error: "Failed to connect to the database." });
        }

        const collectionName = req.params.name;

        try {
            await db.collection(collectionName).drop();
            res.json({ message: `${collectionName} collection deleted successfully.` });
        } catch (error) {
            console.error(`Error deleting collection ${collectionName}:`, error);
            res.status(500).json({ error: `Error deleting collection ${collectionName}.` });
        }
    });
});


//--------------server start----------------------------
app.listen(process.env.APP_PORT,()=>{
    console.log(`server is listeing at ${process.env.APP_PORT}`)
 })