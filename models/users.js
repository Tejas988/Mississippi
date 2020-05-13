const mongo = require('mongodb')
const mongoose = require('mongoose');
const getDb = require('../utils/database').getDb;
const Product =require('./product');


const Schema = mongoose.Schema;

const userSchema = new Schema({
    password: {
        type : String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    cart:{
        items:[{productId : {type :Schema.Types.ObjectId},qty:{type :Number,required:true} }]
    },
  
})


userSchema.methods.addToCart = function(product){
    if(!this.cart)
            {   
                this.cart={items:[]}
            }
            const index = this.cart.items.findIndex(cp => {
                return cp.productId.toString() === product._id.toString();
            })
            console.log(index);
            if(index>=0)
            {
                this.cart.items[index].qty+=1;
            }
            else{
                const newProduct={productId :product._id,qty:1}
                this.cart.items.push(newProduct);
            }
            this.cart=this.cart;
            return this.save();

}
userSchema.methods.getCart= function (){
 
         const productIds = this.cart.items.map(i=>{ return i.productId});
        return Product.find().where('_id').in(productIds).exec()
        //  return Product.find({_id : {$in : productIds}}).toArray()
         .then(products => {
             return products.map( p =>{
                 return {productData : p,qty: this.cart.items.find( i =>{
                     return i.productId.toString() === p._id.toString();
                 }).qty}
             })
         }).catch(err => console.log(err));

}
userSchema.methods.deleteItemFromCart = function(id)
    {
        const updatedCart = this.cart.items.filter( item => {
           return (item.productId.toString() !== id.toString())
        })
        this.cart.items = updatedCart;
        return this.save();
    }
userSchema.methods.clearCart = function(id)
{
    this.cart={items:[]};
    return this.save();

}

module.exports = mongoose.model('User',userSchema);
// module.exports =  class User
// {
//     constructor(username,email,cart,_id)
//     {
//         this.name=username,
//         this.email=email,
//         this.cart = cart,
//         this._id = _id // {items:[]}
//     }
//     save()
//     {
//         const db=getDb();
//         return db.collection('users').insertOne(this).then(result => 
//             {console.log(result)}).catch(err => console.log(err));
//     }

//     addToCart(product){
//         if(!this.cart)
//         {   
//             this.cart={items:[]}
//         }
//         const index = this.cart.items.findIndex(cp => {
//             return cp.productId.toString() === product._id.toString();
//         })
//         console.log(index);
//         if(index>=0)
//         {
//             this.cart.items[index].qty+=1;
//         }
//         else{
//             const newProduct={productId :new mongo.ObjectID(product._id),qty:1}
//             this.cart.items.push(newProduct);
//         }
//         const db=getDb();
//         return db.collection('users').updateOne({_id : new mongo.ObjectID(this._id)},{$set : {cart :this.cart}});

//     }
//     addOrder()
//     {
//         const db=getDb();
//         return this.getCart()
//         .then(products =>{
//             const order={
//                 items:products,
//                 user:{
//                     _id:new mongo.ObjectID(this._id),
//                     name:this.name,
//                     email:this.email
//                 }
//             }
//             return db.collection('orders').insertOne(order).then(
//                 result => {
//                     this.cart={items:[]};
//                    return db.collection('users').updateOne({_id : new mongo.ObjectID(this._id)},{$set : {cart :this.cart}});
//                 }
//             )
//         })
        
//     }
//     getOrder()
//     {
//         const db=getDb();
//         return db.collection('orders').find({'user._id':new mongo.ObjectID(this._id)}).toArray();
//     }
    

//     deleteItemFromCart(id)
//     {
//         const updatedCart = this.cart.items.filter( item => {
//            return (item.productId.toString() !== id.toString())
//         })
//         this.cart.items = updatedCart;
//         const db=getDb();
//         return db.collection('users').updateOne({_id : new mongo.ObjectID(this._id)},{$set : {cart :this.cart}});
//     }

//      getCart()
//      {  
//          const db=getDb();
//          const productIds = this.cart.items.map(i=>{ return i.productId});
//          return db.collection('products').find({_id : {$in : productIds}}).toArray()
//          .then(products => {
//              return products.map( p =>{
//                  return {productData : p,qty: this.cart.items.find( i =>{
//                      return i.productId.toString() === p._id.toString();
//                  }).qty}
//              })
//          }).catch(err => console.log(err));
//      }
//     static findById(id)
//     {
//         const db=getDb();
//         return db.collection('users').findOne({_id:new mongo.ObjectID(id)})
//         .then(result =>{
//             console.log(result);
//             return result;
//         }
//         ).catch(err => console.log(err));
//     }



// }