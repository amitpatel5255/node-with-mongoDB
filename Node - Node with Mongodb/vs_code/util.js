const MongoClient = require('mongodb').MongoClient;

const util = {}

util.getDbConnection = (callback) => {
    MongoClient.connect(process.env.MONGO_URL)
    .then((db) => {
        callback(db.db(process.env.MONGO_DB))
    }).catch((e) => {
        console.log('Failed to connect to MongoDB', e);
        callback(false);
    })
}
//--------------------Create Require collections for online shopping app and documents--------------------------
util.createCollections = async (db) => {
    const collections = [
        'users',
        'productCategories',
        'products',
        'orders',
        'reviews'
    ];

    for (const collection of collections) {
        const exists = await db.listCollections({ name: collection }).hasNext();
        if (!exists) {
            await db.createCollection(collection);
            console.log(`${collection} collection created!`);
        }
    }
};

module.exports = util