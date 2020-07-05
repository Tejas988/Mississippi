const express = require('express');
const User = require('./models/users')
const adminroutes = require('./routes/admin')
const shoproutes = require('./routes/shop');
const authroutes = require('./routes/auth');
const mongoose = require('mongoose');
const session = require('express-session');
const csrf = require('csurf');
const multer = require('multer');
const MongoDbStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const path = require('path');
const isAuthenticated = require('./middleware/protectRoutes');
const shopController = require('./controllers/shop')

const app=express();
const MONGODB_URI='mongodb+srv://Tejas_18:d!R24zBWuvKK7_.@cluster0-g20sx.mongodb.net/online-shop'
// const mongoconnect = require('./utils/database').mongoConnect;
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images')
  },
  filename: function (req, file, cb) {
    cb(null,  Date.now() + '-' + file.originalname )
  }
})
const filefilter = (req,file,cb) =>{

    if(file.mimetype==='image/png' || file.mimetype==='image/jpg' || file.mimetype==='image/jpeg' )
    cb(null,true);//store file
    else
    cb(null,false);//dont store file
}
app.use(express.urlencoded({extended:false}));//using default body parser of express
app.use(multer({storage : storage,fileFilter:filefilter}).single('url'));
app.set('view engine','ejs');
app.set('views','views');
const store=new MongoDbStore({
    uri:MONGODB_URI,
    collection:'sessions'
})

const csrfProtection=csrf();

app.use('/images',express.static(path.join(__dirname,'images')));
app.use('/public',express.static(path.join(__dirname,'public')));


app.use(session({
    secret:'SignMyHash',
    resave:false,
    saveUninitialized:false,//prevents unnecessary saving of sessions where nothing is changed
    store: store 
}))

app.use(flash());
app.use((req,res,next)=>{
    if(!req.session.user)
    return next();
    User.findById(req.session.user).then(user => {
        if(!user)//user not found due to some reasons
        return next();
        req.user=user;
        next();}).catch(err=>  res.status(500).send('<html><h1>Server Down!</h1></html>'))
})

app.use((req,res,next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    next();
})
app.post("/add-order",isAuthenticated,shopController.postOrders);


app.use(csrfProtection);
app.use((req,res,next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
})

app.use('/admin',adminroutes);
app.use(shoproutes);
app.use(authroutes);

app.get('/500',(res,req,next)=>{
    return  res.status(500).send("<html><h1>Server Down!</h1></html>")
})
app.use((req,res,next)=>{
    res.status(404).send('<html><h1>Page Not Found!</h1></html>')
})

app.use((err,res,req,next)=>{
    return  res.redirect('/500');
})

mongoose.connect('mongodb+srv://Tejas_18:d!R24zBWuvKK7_.@cluster0-g20sx.mongodb.net/online-shop?retryWrites=true&w=majority')
.then(result =>{
    app.listen(3000);
}).catch(err =>{
    console.log(err);
})
