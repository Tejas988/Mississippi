const express = require("express");
const path = require("path");
const {check,body} = require('express-validator')
const adminControllers = require("../controllers/admin")
const isAuthenticated = require('../middleware/protectRoutes');

const router = express.Router();


router.post("/add-product",[
body('product').isString().isLength({min:3}).trim(),
body('price').isNumeric(),
body('description').isLength({min:5,max:250}).trim()

], isAuthenticated,adminControllers.postAddProduct);
router.get("/add-product", isAuthenticated,adminControllers.getAddProduct);
router.get("/products", isAuthenticated,adminControllers.adminProducts);
router.delete("/delete-product/:productId",isAuthenticated,adminControllers.DeleteItem);
router.get("/edit-product/:productId", isAuthenticated,adminControllers.getEditProduct)
router.post("/edit-product/",[
    body('product').isString().isLength({min:3}).trim(),
    body('price').isNumeric(),
    body('description').isLength({min:5,max:250}).trim()
    
    ], isAuthenticated,adminControllers.postEditProduct);



module.exports = router;