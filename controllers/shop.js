const Product = require("../models/product");
const User = require("../models/users");
const Order = require("../models/orders");
const fs = require("fs");
const PDFDocument = require("pdfkit");
const path = require("path");
const stripe = require("stripe")(
  "sk_test_51H1AlYBG4sAHCewRyddSpEWAGFo3fiGmu6wEsIML9JOx0AwuHqQvQpFxz8IDrSgI16CW8QuaGz4PvOquqJ02b5Lt00G9GmuV9N"
);

const ITEMS_PER_PAGE = 4;
exports.getProducts = (req, res, next) => {
  //  Product.getAllProducts((products)=>{
  //   res.render('shop/product-list',{prods : products,pageTitle : 'Shop',pg:'product-list'});
  //   });//****FILE */
  const page = +req.query.page || 1;
  let totalProd;
  Product.find()
    .count()
    .then((numProds) => {
      totalProd = numProds;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((response) => {
      console.log(response);
      res.render("shop/product-list", {
        prods: response,
        pageTitle: "Shop",
        pg: "product-list",
        currPg: page,
        hasNextPg: ITEMS_PER_PAGE * page < totalProd ? true : false,
        hasPrevPg: page > 1 ? true : false,
        nextPg: page + 1,
        previousPg: page - 1,
        lastPg: Math.ceil(totalProd / ITEMS_PER_PAGE),
      });
    })
    .catch((e) => res.status(500).send("<html><h1>Server Down!</h1></html>"));
};
exports.deleteCartItem = (req, res, next) => {
  const uid = req.body.id;
  req.user
    .deleteItemFromCart(uid)
    .then((response) => {
      console.log(response);
      res.redirect("/cart");
    })
    .catch((err) => res.status(500).send("<html><h1>Server Down!</h1></html>"));
};
exports.getCart = (req, res, next) => {
  console.log(req.session.user);
  //we can also use .populate() and execPopulate() to populate the productId with its info;
  req.user.getCart().then((products) => {
    res.render("shop/cart", {
      pageTitle: "Cart",
      pg: "cart",
      cartProds: products,
      isAuthenticated: req.session.isLoggedIn,
    });
  });
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
};
exports.postCart = (req, res, next) => {
  const productId = req.body.id;
  console.log(productId);
  Product.findById(productId)
    .then((result) => {
      return req.user.addToCart(result);
    })
    .then((result) => {
      console.log(result);
      res.redirect("/cart");
    })
    .catch((err) => res.status(500).send("<html><h1>Server Down!</h1></html>"));
};
exports.getIndex = (req, res, next) => {
  res.render("shop/index", {
    pageTitle: "Home",
    pg: "shop",
    isAuthenticated: req.session.isLoggedIn,
  });
};
exports.getOrders = (req, res, next) => {
  console.log(req.session.user._id);
  Order.find({ "user.userId": req.session.user._id }).then((orders) => {
    console.log(orders);
    res.render("shop/orders", {
      pageTitle: "Orders",
      pg: "order",
      userOrders: orders,
      isAuthenticated: req.session.isLoggedIn,
    });
  });
};
exports.postOrders = (req, res, next) => {
  let total = 0;
  const token = req.body.stripeToken;
  console.log(token);
  var today = new Date();
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  req.user
    .getCart()
    .then((prods) => {
      console.log(prods);
      prods.forEach((p) => {
        total += p.productData.price * p.qty;
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user, //mongoose will pick the id
        },
        products: prods,
        dateTime: {
          date: date,
          time: time,
        },
      });
      return order.save();
    })
    .then((response) => {
      const charge = stripe.charges.create({
        amount: total * 100,
        currency: "inr",
        description: `Date : ${date}   Time : ${time}`,
        source: token,
        metadata: { order_id: response._id.toString() },
      });
      console.log(req.user);
      req.user.clearCart();
    })
    .then((resp) => {
      res.redirect("./orders");
    });
};
exports.getSingleProduct = (req, res, next) => {
  const uid = req.params.productId;
  // Product.findById(uid, product => {
  //   res.render('shop/product-detail',{pageTitle:product.product,pg:'product-list',product:product});
  // })
  console.log(uid);
  Product.findById(uid)
    .then((product) => {
      User.findById(product.userID).then((user) => {
        res.render("shop/product-detail", {
          pageTitle: product.title,
          pg: "product-list",
          product: product,
          user: user.email,
        });
      });
    })
    .catch((err) => res.status(500).send("<html><h1>Server Down!</h1></html>"));
};

exports.getBill = (req, res, next) => {
  const order_id = req.params.orderID;
  const billName = "bill-" + order_id + ".pdf";
  const billPath = path.join("data", "invoices", billName);
  Order.findById(order_id)
    .then((order) => {
      const pdfDoc = new PDFDocument({compress:false});
      res.setHeader("Content-Type", "application/pdf"); //this type of sending small chunks of data is usefull while handling large files as it will not make the server slow
      res.setHeader(
        "Content-Disposition",
        'inline; filename="' + billName + '"'
      );
      console.log(billPath); //generating pdf on the fly                                                      //creating a stream so that data is streamed in chunks and browser will then condense it or merge it at its side
      pdfDoc.pipe(fs.createWriteStream(billPath)); //how file shd be shown or operated
      pdfDoc.pipe(res); //response streamed
      pdfDoc.font("Times-Roman").text("INVOICE", {
        align: "center",
      });
      pdfDoc.text("--------------------------------", {
        align: "center",
      });
      const userEmail = order.user.email;
      pdfDoc.text(`Email ID  :  ${userEmail}`, {
        align: "center",
      });
      let totalPrice = 0;
      let a = 200,
        b = 150;
      order.products.forEach((prod) => {
        totalPrice += prod.qty * prod.productData.price;
        pdfDoc.image(prod.productData.imageURL, a, b, {
          fit: [100, 100],
        });
        b += 25;
        pdfDoc
          .text(
            prod.productData.title + " - " + "Quantity : " + prod.qty,
            a,
            b,
            {
              align: "center",
            }
          )
          .moveDown(0.5);
        b += 25;
        pdfDoc.text(`Price  :  ${prod.productData.price}`, a, b, {
          align: "center",
        });
        b += 25;
        pdfDoc.text("--------------", a, b, {
          align: "center",
        });
        b += 60;
      });
      pdfDoc.text(`Total Price : ${totalPrice}`, 90, b, {
        align: "center",
      });
      pdfDoc.end();
    })
    
    .catch((e) => 
    {
      throw new Error(e);
    });
};

exports.Checkout = (req, res, next) => {
  req.user
    .getCart()
    .then((products) => {
      let total = 0;
      console.log(products);
      products.forEach((p) => {
        total += p.productData.price * p.qty;
      });
      res.render("shop/checkout", {
        pageTitle: "Checkout",
        pg: "Checkout",
        cartProds: products,
        isAuthenticated: req.session.isLoggedIn,
        totalPrice: total,
      });
    })
    .catch((e) => {
      console.log(e);
      res.status(500).send("<html><h1>Server Down!</h1></html>");
    });
};
