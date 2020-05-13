const Product = require('../models/product')
const User = require('../models/users')
const Order = require('../models/orders')

exports.getProducts = (req,res,next)=>{
  //  Product.getAllProducts((products)=>{
  //   res.render('shop/product-list',{prods : products,pageTitle : 'Shop',pg:'product-list'});
  //   });//****FILE */
  Product.find().then( response =>{
    console.log(req.session.isLoggedIn);
   res.render('shop/product-list',{prods : response,pageTitle : 'Shop',pg:'product-list',isAuthenticated:req.session.isLoggedIn});
  }).catch()
    
}
exports.deleteCartItem = (req,res,next)=>{
 const uid =req.body.id;
 req.user.deleteItemFromCart(uid).then(response => {
   console.log(response);
  res.redirect('/cart');
 }).catch(err => console.log(err));
}
exports.getCart = (req,res,next)=>{
  console.log(req.session.user);
//we can also use .populate() and execPopulate() to populate the productId with its info;
  req.user.getCart().then(products => {
    res.render('shop/cart',{pageTitle : 'Cart',pg:'cart',cartProds:products,isAuthenticated:req.session.isLoggedIn});
  })
  


  // Cart.getAllProducts((cart)=>{
  //   Product.getAllProducts(products =>{
  //     const cartProducts = [];
  //     for(product of products)
  //     { const cartProductData = cart.products.find(p => p.id === product.id)
  //       if(cartProductData)
  //       {
  //         cartProducts.push({productData : product,qty:cartProductData.qty})
  //       }
  //     }
  //     console.log(cartProducts);
  //     res.render('shop/cart',{pageTitle : 'Cart',pg:'cart',cartProds:cartProducts}); 
  //   }
  //   )
    
  // }
  
  // )
 
  }
exports.postCart = (req,res,next)=>{
  const productId = req.body.id;
  console.log(productId);
  Product.findById(productId).then(result =>{
    return req.user.addToCart(result);
  }).then(result =>
    { console.log(result)
      res.redirect('/cart');
      }
      ).catch(err => console.log(err));
}
exports.getIndex = (req,res,next)=>{
  res.render('shop/index',{pageTitle : 'Home',pg:'shop',isAuthenticated:req.session.isLoggedIn});
 }
exports.getOrders = (req,res,next) =>{
  console.log(req.session.user._id)
  Order.find({'user.userId':req.session.user._id}).
  then(orders =>{
    console.log(orders);
  res.render('shop/orders',{pageTitle : 'Orders' ,pg : 'order',userOrders:orders,isAuthenticated:req.session.isLoggedIn});
  })
  
}
exports.postOrders = (req,res,next) =>{
  req.user.getCart().then(prods => {
    const order = new Order(
      {
        user:{
         email:req.user.email,
          userId:req.user //mongoose will pick the id
        },
        products:prods
      }
    )
    return order.save()
  }).then(response => {
    console.log(req.user)
    req.user.clearCart()
  }).then(resp=>{
    res.redirect('./orders');
  })
}
exports.getSingleProduct = (req,res,next)=>{
  const uid = req.params.productId;
  // Product.findById(uid, product => {
  //   res.render('shop/product-detail',{pageTitle:product.product,pg:'product-list',product:product});
  // })
  Product.findById(uid).then((product)=>{
    res.render('shop/product-detail',{pageTitle:product.title,pg:'product-list',product:product,isAuthenticated:req.session.isLoggedIn});
  }).catch(err => console.log(err))
  
}