const Product = require('../models/product')
const Cart = require('../models/cart.js')
const mongo = require('mongodb')
const {validationResult}=require('express-validator/check')
const fileHelper = require('../util/file')

exports.getAddProduct = (req, res, next) => {
    res.render("admin/edit-product",
     { pageTitle: "AddProducts", pg: "add_p",editing:false,
     isAuthenticated:req.session.isLoggedIn,
     product:{
      title:'',
      price:'',
      description:'',
    },
    hasError:false,
    errormsg:null,
    });
  }
exports.getEditProduct = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id).then(product =>{
      console.log(product);
      res.render("admin/edit-product", 
      { pageTitle: "EditProducts", 
      pg: "edit_p",
      editing:true,
      hasError:false,
      isAuthenticated:req.session.isLoggedIn,
      product:product,
      errormsg:null
    });
    })
    
  }

exports.postEditProduct = (req,res,next)=>{
  // const product = new Product(req.body.product,req.body.price,req.body.description,req.body.url,new mongo.ObjectID(req.body.pid));
  const errors=validationResult(req);
  const prod = req.body.product;
    const image = req.file;
    const des = req.body.description;
    const price= req.body.price;
  if(!errors.isEmpty())
    { console.log(errors.array())
      res.render("admin/edit-product", 
      { pageTitle: "Edit Products", 
      pg: "edit_p",
      editing:true,
      isAuthenticated:req.session.isLoggedIn,
      hasError:true,
      product:{
        title:prod,
        price:price,
        description:des
      },
      errormsg:errors.array()[0].msg
    });
    }
  Product.findById(req.body.pid).then(product =>{

    if(product.userID.toString() !== req.user._id.toString())
    {
      return res.redirect('/');
    }
    product.title=req.body.product;
    product.price=req.body.price;
    product.description=req.body.description;
    if(image)
    {
    fileHelper.deleteFile(product.imageURL);
    product.imageURL=image.path;
    }
    //console.log("SAS");
        product.save().then(()=>{
      res.redirect("/products");
     }).catch(err => res.status(500).send('<html><h1>Server Down!</h1></html>'));
  })
  
}
exports.postAddProduct = (req,res,next)=>{
    const prod = req.body.product;
    const image = req.file;
    console.log(image);
    const des = req.body.description;
    const price= req.body.price;
    const errors=validationResult(req);
    if(!errors.isEmpty())
    {
      res.status(422).render("admin/edit-product", 
      { pageTitle: "Add Products", 
      pg: "edit_p",
      editing:false,
      isAuthenticated:req.session.isLoggedIn,
      product : prod,
      hasError:true,
      product:{
        title:prod,
        price:price,
        description:des
      },
      errormsg:errors.array()[0].msg
    });
    }
    if(!image)
    {
        res.status(422).render("admin/edit-product", 
      { pageTitle: "Add Products", 
      pg: "edit_p",
      editing:false,
      isAuthenticated:req.session.isLoggedIn,
      product : prod,
      hasError:true,
      product:{
        title:prod,
        price:price,
        description:des
      },
      errormsg:'Make sure u enter an image'
    });
    }
//we shd not store the images in db as retrieval may take long we must thus store the path in db

    const imgPath = image.path;
  console.log(imgPath)
     const product = new Product({title :prod,price : price,description :des,imageURL :imgPath,userID:req.session.user._id});
     product.save()//from mongoose
     .then(()=>{                      //technically not a promise but a method
      res.redirect("/products");
     }).catch(err => res.status(500).send('<html><h1>Server Down!</h1></html>')
     );
    
 }
exports.DeleteItem = (req,res,next) =>{

    const uid= req.params.productId;
    Product.findById(uid).then(product => {
      if(!product)
      {
        return res.status(500).send('<html><h1>Server Down!</h1></html>')
      }
      //fileHelper.deleteFile(product.imageURL);
      return Product.deleteOne({_id:uid,userID:req.user._id})
    })
    .then(resp => {
      console.log(resp);
      res.status(200).json({msg:'Success!'})
    }).catch(e=>res.status(500).json({msg:'Failed'}))
  
}
 
exports.adminProducts = (req,res,next)=>{
  
    Product.find({'userID':req.user._id}).then(products=>{
     res.render('admin/products',
     {prods : products,
      pageTitle : 'Admin Products',
      pg:'admin_prod',
      isAuthenticated:req.session.isLoggedIn,

    });
     }).catch(err=>res.status(500).send('<html><h1>Server Down!</h1></html>'))
     
 }