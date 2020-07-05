const express = require('express');
const authController =require('../controllers/auth')
const {check,body} = require('express-validator')
const User = require('../models/users');
const router = express.Router();
router.get("/login",authController.getLogin);
router.post("/login",[
    body('email').isEmail().withMessage('Enter a valid email address').normalizeEmail(),
],authController.postLogin);
router.post("/logout",authController.postLogout);
router.get("/signup",authController.getSignup);
router.get("/forgotpass",authController.getResetPass);
router.post("/forgotpass",authController.postResetPass);
router.post("/new-pass",authController.postNewPassword);
router.get("/forgotpass/:token",authController.getNewPassword);
router.post("/signup",[
    check('email').isEmail().withMessage('Please enter a valid email').normalizeEmail()
    .custom((value,{res})=>{
        return User.findOne({email:value}).then(userDoc=>{
            if(userDoc)
            {  
                return Promise.reject('E-mail already exists!!');
            }

    })
}),
    body('pass','Please enter a password with more than 5 alphanumeic characters').isLength({min:5}).isAlphanumeric().trim(),
    body('confirmpass').trim().custom((value,{req}) =>{
        console.log(value,req.body.pass);
        if(value !== req.body.pass)
        {
            throw new Error('Passwords not matching!');
        }
        return true;
    })
],authController.postSignup);
module.exports = router;
