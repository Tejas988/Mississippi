const express = require("express");
const path = require("path");
const adminControllers = require("../controllers/admin")
const isAuthenticated = require('../middleware/protectRoutes');

const router = express.Router();


router.post("/add-product", isAuthenticated,adminControllers.postAddProduct);
router.get("/add-product", isAuthenticated,adminControllers.getAddProduct);
router.get("/products", isAuthenticated,adminControllers.adminProducts);
router.get("/delete-product/:productId",isAuthenticated,adminControllers.DeleteItem);
router.get("/edit-product/:productId", isAuthenticated,adminControllers.getEditProduct)
router.post("/edit-product/", isAuthenticated,adminControllers.postEditProduct);



module.exports = router;