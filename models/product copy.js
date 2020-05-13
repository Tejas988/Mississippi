const fs = require('fs')
const path = require('path');
const p = path.join(path.dirname(process.mainModule.filename),'data','products.json');
const db = require('../utils/database'); 
const Cart = require('./cart.js')
module.exports = class Product{

    constructor(id,title,price,descripton,image)
    {   this.id=id;
        this.title = title;
        this.price = price;
        this.descripton = descripton;
        this.image = image
    }
    save()
    {
        /************** FILE CODE *************/
        // fs.readFile(p,(err,data)=>{
        //    let products = []
        //     if(!err)
        //     {
        //         products = JSON.parse(data);  
        //     }
        //     if(this.id)
        //     {
        //         const index = products.findIndex(p => p.id===this.id);
        //         const obj = {product: this.title,img:this.image, des : this.descripton,price:this.price,id:this.id}
        //         products[index]=obj;
        //         fs.writeFile(p,JSON.stringify(products),(err)=>{
        //             console.log(err);
        //         });
        //     }
        //     else{
        //     const uid= Math.random().toString();
        //     const obj = {product: this.title,img:this.image, des : this.descripton,price:this.price,id:uid}
        //     products.push(obj);
        //     fs.writeFile(p,JSON.stringify(products),(err)=>{
        //         console.log(err);
        //     });
        // }
        // })
         /************** FILE CODE END*************/

       return  db.execute('INSERT INTO products (title,price,description,imageURL) VALUES (?,?,?,?)'
         ,[this.title,this.price,this.descripton,this.image]); // extra security    
        
    }
    static deleteProduct(id)
    {    
        /************** FILE CODE *************/
        // fs.readFile(p,(err,data)=>{
        //     const indx = JSON.parse(data).findIndex(pr => pr.id===id)
        //     const prods = JSON.parse(data);
        //     const pr = prods[indx].price;
        //     const deletedProds = prods.splice(indx,1);
        //     fs.writeFile(p,JSON.stringify(prods),(err)=>{
        //         console.log(err);
        //         Cart.deleteProduct(id,pr);
        //     });

        // })
         /************** FILE CODE END*************/

    }
    static getAllProducts()
    {   
         /************** FILE CODE *************/
        // fs.readFile(p,(err,data)=>{
        //     console.log(err);
        //     if(err)
        //     cb([]);
        //     else
        //     {
        //     cb(JSON.parse(data));
        //     }
        // })
         /************** FILE CODE END*************/

        return db.execute('SELECT * from products');

    }
    static findById(id)
    {   
         /************** FILE CODE *************/
        // fs.readFile(p,(err,data)=>{
        //     if(!err)
        //     {
        //     const product = JSON.parse(data).find(pr => pr.id===id)
        //     cb(product);}
        //     else
        //     console.log(err);
        // })
         /************** FILE CODE END*************/
       return  db.execute('SELECT * from products WHERE products.id = ?',[id]);
    }
}