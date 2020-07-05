const express = require('express');
const path = require('path');
const isAuthenticated = require('../middleware/protectRoutes');
const router = express.Router();
const shopController = require('../controllers/shop')

router.get("/",shopController.getIndex);
router.get("/cart",isAuthenticated,shopController.getCart);
router.post("/cart",isAuthenticated,shopController.postCart);
router.get("/products",shopController.getProducts);
router.get("/orders",isAuthenticated,shopController.getOrders);
router.get("/checkout",isAuthenticated,shopController.Checkout);
router.get("/orders/:orderID",isAuthenticated,shopController.getBill);
router.get("/products/:productId",shopController.getSingleProduct);
router.post("/delete-cart",isAuthenticated,shopController.deleteCartItem);
module.exports = router;