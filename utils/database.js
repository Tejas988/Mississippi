// const mysql = require('mysql2');

// const pool = mysql.createPool({
//     host : 'localhost',
//     user : 'root',
//     database : 'online-shop',
//     password : 'Tejas@18'
// })

// module.exports = pool.promise();
const mongodb = require('mongodb');
MongoClient = mongodb.MongoClient
let db;
const mongoConnect = (callback) => {
MongoClient.connect('mongodb+srv://Tejas_18:d!R24zBWuvKK7_.@cluster0-g20sx.mongodb.net/shop?retryWrites=true&w=majority',{useUnifiedTopology : true })
.then(client =>{
    console.log('Connected');
    db=client.db()
    callback();
}).
catch(err =>{
    console.log(err);
});
}

const getDb = ()=>{
    if(db)
    return db
    else
    throw 'No db found'
}
exports.mongoConnect = mongoConnect;
exports.getDb = getDb;