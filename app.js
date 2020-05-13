const express = require('express');
const User = require('./models/users')
const adminroutes = require('./routes/admin')
const shoproutes = require('./routes/shop');
const authroutes = require('./routes/auth');
const mongoose = require('mongoose');
const session = require('express-session');
const csrf = require('csurf');
const MongoDbStore = require('connect-mongodb-session')(session);

const app=express();
const MONGODB_URI='mongodb+srv://Tejas_18:d!R24zBWuvKK7_.@cluster0-g20sx.mongodb.net/online-shop'
// const mongoconnect = require('./utils/database').mongoConnect;
app.use(express.urlencoded({extended:false}));
app.set('view engine','ejs');
app.set('views','views');
const store=new MongoDbStore({
    uri:MONGODB_URI,
    collection:'sessions'
})
const csrfProtection=csrf();


app.use(session({
    secret:'SignMyHash',
    resave:false,
    saveUninitialized:false,//prevents unnecessary saving of sessions where nothing is changed
    store: store 
}))
app.use(csrfProtection);
app.use((req,res,next)=>{
    if(!req.session.user)
    return next();
    User.findById(req.session.user).then(user => {
        req.user=user;
        next();}).catch(err=>console.log(err))
})

app.use('/admin',adminroutes);
app.use(shoproutes);
app.use(authroutes);


app.use((req,res,next)=>{
    res.status(404).send('<html><h1>Page Not Found!</h1></html>')
})

mongoose.connect('mongodb+srv://Tejas_18:d!R24zBWuvKK7_.@cluster0-g20sx.mongodb.net/online-shop?retryWrites=true&w=majority')
.then(result =>{
    app.listen(3000);
}).catch(err =>{
    console.log(err);
})
