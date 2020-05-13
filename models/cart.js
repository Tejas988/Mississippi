const fs = require('fs')
const path = require('path');
const p = path.join(path.dirname(process.mainModule.filename),'data','carts.json');
module.exports = class Cart{

    static Addproduct(id,productPrice){
        fs.readFile(p,(er,data)=>{
            let cart = {products:[],totalAmount :0}
            if(!er)
            {
                cart=JSON.parse(data);
            }
            const index = cart.products.findIndex(p => p.id===id);
            const exists = cart.products[index];
            let updatedProduct;
            if(exists)
            {
               cart.products[index].qty+=1;
            } 
            else{
                updatedProduct={id:id,qty:1}; 
                cart.products.push(updatedProduct);
            }
            cart.totalAmount+=parseInt(productPrice);
            fs.writeFile(p,JSON.stringify(cart),err =>{
                console.log(err);
            })
        })
    }

    static deleteProduct(id,productPrice)
    {
        fs.readFile(p,(er,data)=>{
            let cart = {products:[],totalAmount :0}
            if(!er)
            {
                cart=JSON.parse(data);
            }
            console.log(cart,id)
            const index = cart.products.findIndex(p => p.id===id);
            console.log(cart.products)
            cart.totalAmount=cart.totalAmount-(parseInt(productPrice)*cart.products[index].qty);
            cart.products.splice(index,1);
            fs.writeFile(p,JSON.stringify(cart),err =>{
                console.log(err);
            })
        }
    )
    }
    static getAllProducts(cb)
    {
        fs.readFile(p,(err,data)=>{
            console.log(err);
            if(err)
            cb([]);
            else
            {
            cb(JSON.parse(data));
            }
        })

    }
    
}