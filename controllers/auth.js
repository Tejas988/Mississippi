const User = require('../models/users')
const bcrypt =require('bcryptjs');
const nodemailer = require('nodemailer');
const sgt = require('nodemailer-sendgrid-transport');
const {validationResult}=require('express-validator/check')//check middleware will add errors on req object which can be retrieved using this
const crypto = require('crypto');//for token for resetting password

const transporter= nodemailer.createTransport(sgt({
    auth:{
    api_key:'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'
    }
}))
exports.getLogin=(req,res,next)=>{
    // const isLoggedIn =req.get('Cookie').split('=')[1];
    let msg=req.flash('error');
    if(msg.length > 0)
    msg=msg[0];
    else
    msg=null
    res.render('auth/login',{
        pg:"login",
        pageTitle:"Login",
        errormsg : msg,
        oldData:{email:"",password:""},
        validationErrors:[]
    })
}
exports.postLogin=(req,res,next)=>{
    // res.setHeader('Set-Cookie','loggedIn=true'); set cookie
    const email=req.body.email;
    const pass=req.body.password
    const errors=validationResult(req)
    if(!errors.isEmpty())
    {   
        res.render('auth/login',{
            pg:"login",
            pageTitle:"Login",
            errormsg : errors.array()[0].msg,
            oldData:{email:email,password:pass},
            validationErrors:[]
        })
    }
    User.findOne({email:email}).then(user=>{
        if(!user)
        {   
            return  res.render('auth/login',{
                pg:"login",
                pageTitle:"Login",
                errormsg : "Invalid Email",
                oldData:{email:email,password:pass},
                validationErrors:[]
            });
        }
        bcrypt.compare(pass,user.password).then(didmatch =>{
            if(!didmatch)
            return res.render('auth/login',{
                pg:"login",
                pageTitle:"Login",
                errormsg : "Invalid password",
                oldData:{email:email,password:pass},
                validationErrors:[]
            });
            else
             {req.session.isLoggedIn =true;
                req.session.user=user;
                 console.log(user,"ha");
                return req.session.save(()=>{
                      res.redirect('/');
                })}
        }).catch(err=> res.status(500).send('<html><h1>Server Down!</h1></html>'));
       
    }).catch(err =>{
        res.status(500).send('<html><h1>Server Down!</h1></html>')
    })
   
}
exports.getResetPass= (req,res,next)=>
{
    let msg=req.flash('error');
    if(msg.length > 0)
    msg=msg[0];
    else
    msg=null
    res.render('auth/resetpass',{
        pg:'password',
        pageTitle:'ResetPassword',
        errormsg:msg,
    })
}
exports.postResetPass = (req,res,next)=>{
    crypto.randomBytes(32,(err,buffer)=>{//generate token buffer of 32 bytes
        if(err)
        {
            console.log(err);
            res.redirect('/forgotpass');
        }
        const token = buffer.toString('hex');
        User.findOne({email:req.body.email}).then(user =>{
            if(!user)
            {
            req.flash('error','No account with the entered email')
            return res.redirect('/forgotpass');
        }
            user.resetToken = token;//set token
            user.resetTokenExpiration = Date.now() + 3600000;//to set expiry of 1 hr 
            return user.save();

        }).then(response=>{
            res.redirect('/')
            transporter.sendMail({
                to:req.body.email,
                from:'tejasghone73@gmail.com',
                subject:'Password Reset',
                html:`<h2>You requested a password request</h2>
                        <p>Click this <a href="http://localhost:3000/forgotpass/${token}">resetLink</a></p>`
            })

        }).catch(err => res.status(500).send('<html><h1>Server Down!</h1></html>'));
    })
}
exports.getSignup=(req,res,next)=>{
    let msg=req.flash('error');
    if(msg.length > 0)
    msg=msg[0];
    else
    msg=null
    res.render('auth/signup',{
        pg:"signup",
        pageTitle:"Signup",
        errormsg : msg,
        oldData:{email:"",password:"",confirmpassword:""},
        validationErrors:[]
    })    
}
exports.postSignup=(req,res,next)=>{
    const email=req.body.email;
    const password=req.body.pass;
    const confirmpassword=req.body.confirmpass;
    const errors=validationResult(req)
    if(!errors.isEmpty())
    {   
        return res.status(422).
        render('auth/signup',{
            pg:'password',
            pageTitle:'ResetPassword',
            errormsg:errors.array()[0].msg,
            oldData:{email:email,password:password,confirmpassword:confirmpassword},
            validationErrors:errors.array()
        })
    }
    
      bcrypt.hash(password,12)
      .then(pass=>{
        const user=new User({
            email:email,
            password:pass,
            cart:{items:[]}
        });
        return user.save(); 
    }).then(response=>{
        res.redirect('/login')
       return transporter.sendMail({
            to:email,
            from:'tejasghone73@gmail.com',
            subject:'Signup Succeeded',
            html:`<h1>Welcome to Mississippi!</h1>
                    <h3>You successfully signed up! Hope you have a great time :)</h3>`
        })
    }).catch(err => res.status(500).send('<html><h1>Server Down!</h1></html>'));
}
exports.postLogout=(req,res,next)=>{
    // res.setHeader('Set-Cookie','loggedIn=true'); set cookie
    req.session.destroy(()=>{
        console.log('byeee');
        res.redirect('/');
    })
}

exports.getNewPassword=(req,res,next)=>{

    const token=req.params.token;
    User.findOne({
        resetToken:token,
        resetTokenExpiration:{$gt: Date.now()}//exisiting date is current date then now whiche means it hasnt expired
    })
    .then(user=>{
        if(!user)
        {
            req.flash('error','Token Expired')
            return res.redirect('/forgotpass');
        }
        else
        {
    let msg=req.flash('error');
    if(msg.length > 0)
    msg=msg[0];
    else
    msg=null
    res.render('auth/new-pass',{
        pg:"paswdd",
        pageTitle:"NewPassword",
        errormsg : msg,
        userID:user._id.toString(),
        passwordToken:token
    })    
        }
    })
    .catch(err => res.status(500).send('<html><h1>Server Down!</h1></html>'))
}
exports.postNewPassword=(req,res,next)=>{
    const newpassword=req.body.password;
    const userID=req.body.userID;
    const token=req.body.passwordToken;
    let resetUser
    User.findOne({
        resetToken:token,
        resetTokenExpiration:{$gt:Date.now()},
        _id:userID,
    })
    .then(user =>{
        resetUser=user;
        return bcrypt.hash(newpassword,12);
    })
    .then(hashedPass =>{
        resetUser.password=hashedPass;
        resetUser.resetTokenExpiration=undefined;
        resetUser.resetToken=undefined;
        return resetUser.save();
    })
    .then(result =>{
        res.redirect('/login');
    })
    .catch(err=>res.status(500).send('<html><h1>Server Down!</h1></html>'));


}