const Product = require('../models/product')
const Cart = require('../models/cart.js')
const mongo = require('mongodb')
exports.getAddProduct = (req, res, next) => {
    res.render("admin/edit-product", { pageTitle: "AddProducts", pg: "add_p",editing:false,isAuthenticated:req.session.isLoggedIn});
  }
exports.getEditProduct = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id).then(product =>{
      console.log(product);
      res.render("admin/edit-product", 
      { pageTitle: "EditProducts", 
      pg: "edit_p",
      editing:true,
      product : product,
      isAuthenticated:req.session.isLoggedIn,
    });
    })
    
  }

exports.postEditProduct = (req,res,next)=>{
  // const product = new Product(req.body.product,req.body.price,req.body.description,req.body.url,new mongo.ObjectID(req.body.pid));
  Product.findById(req.body.pid).then(product =>{
    product.title=req.body.product;
    product.price=req.body.price;
    product.description=req.body.description;
    product.imageURL=req.body.url;
    product.save().then(()=>{
      res.redirect("/products");
     }).catch(err => console.log(err));
  })
  
}
exports.postAddProduct = (req,res,next)=>{
    const prod = req.body.product;
    const image = req.body.url;
    const des = req.body.description;
    const price= req.body.price;
     const product = new Product({title :prod,price : price,description :des,imageURL :image,userID:req.session.user._id});
     product.save()//from mongoose
     .then(()=>{                      //technically not a promise but a method
      res.redirect("/products");
     }).catch(err => console.log(err));
    
 }
exports.DeleteItem = (req,res,next) =>{

    const uid= req.params.productId;
    Product.findByIdAndDelete(uid).then(resp => {
      console.log(resp);
      res.redirect("/products");
    }).catch(err => console.log(err));
    // Product.deleteProduct(new mongo.ObjectID(uid)).then(()=>{
    //   res.redirect("/products");
    // }).catch(err => console.log(err));
    
}
 
exports.adminProducts = (req,res,next)=>{
  
    Product.find().then(products=>{
     res.render('admin/products',{prods : products,pageTitle : 'Admin Products',pg:'admin_prod',isAuthenticated:req.session.isLoggedIn});
     }).catch(err=>console.log(err))
     
 }