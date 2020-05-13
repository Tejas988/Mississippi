const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    title : {
        type : String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    imageURL :{
        type :String,
        required :true
    },
    userID:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
})
module.exports = mongoose.model('Products',productSchema);
















































// const mongodb = require('mongodb');
// const MongoConnect = require('../utils/database')
// const getDb = require('../utils/database').getDb;

// module.exports=class Product{
//     constructor(title,price,description,imageURL,_id)
//     {
//         this.title=title,
//         this.price=price,
//         this.description=description,
//         this.imageURL=imageURL,
//         this._id=_id;
//     }

//     save()
//     {
//         const db=getDb();
//         let dObj;
//         if(this._id)
//         {
//             dObj=db.collection('products').updateOne({_id:new mongodb.ObjectID(this._id)},{$set : this});
//         }
//         else
//         {
//             dObj=db.collection('products').insertOne(this);
//         }
//         return dObj.then(result => console.log(result)).catch(err => console.log(err));
//     }
//     static getAllProducts()
//     {
//         const db=getDb();
//         return db.collection('products').find().toArray()
//         .then(result => {
//         console.log(result)
//         return result}).
//         catch(err => console.log(err))
//     }
//     static findById(id){
//         const db=getDb();
//         return db.collection('products').find({_id:new mongodb.ObjectID(id)}).next()
//         .then(result => {
//         console.log(result)
//         return result}).
//         catch(err => console.log(err))
//     }
//     static deleteProduct(id)
//     {
//         const db=getDb();
//         return db.collection('products').deleteOne({_id:id})
//         .then( res => console.log(res)).catch(err => console.log(err));
//     }
// }