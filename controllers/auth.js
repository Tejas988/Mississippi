const User = require('../models/users')
const bcrypt =require('bcryptjs');
exports.getLogin=(req,res,next)=>{
    // const isLoggedIn =req.get('Cookie').split('=')[1];
    res.render('auth/login',{
        pg:"login",
        pageTitle:"Login",
        isAuthenticated:req.session.isLoggedIn,
    })
}
exports.postLogin=(req,res,next)=>{
    // res.setHeader('Set-Cookie','loggedIn=true'); set cookie
    const email=req.body.email;
    const pass=req.body.password
    User.findOne({email:email}).then(user=>{
        if(!user)
        {
            return res.redirect('/login');
        }
        bcrypt.compare(pass,user.password).then(didmatch =>{
            if(!didmatch)
            return res.redirect('/login');
            else
             {req.session.isLoggedIn =true;
                req.session.user=user;
                return req.session.save(()=>{
                      res.redirect('/');
                })}
        }).catch(err=> console.log(err));
        console.log(user);
        
        
    }).catch(err =>{
        console.log(err);
    })
   
}
exports.getSignup=(req,res,next)=>{
    res.render('auth/signup',{
        pg:"signup",
        pageTitle:"Signup",
        isAuthenticated:req.session.isLoggedIn,
    })    
}
exports.postSignup=(req,res,next)=>{
    const email=req.body.email;
    const password=req.body.pass;
    const confirmpassword=req.body.confirmpass;
    User.findOne({email:email}).then(userDoc=>{
      if(userDoc)
      return res.redirect('/signup');
      return bcrypt.hash(password,12)
      .then(pass=>{
        const user=new User({
            email:email,
            password:pass,
            cart:{items:[]}
        });
        return user.save(); 
    }).then(response=>{
        res.redirect('/login')
    });
       
    }).catch(err => console.log(err))

}
exports.postLogout=(req,res,next)=>{
    // res.setHeader('Set-Cookie','loggedIn=true'); set cookie
    req.session.destroy(()=>{
        console.log('byeee');
        res.redirect('/');
    })
}