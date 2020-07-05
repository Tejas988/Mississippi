const fs = require('fs');
const { deleteOne } = require('../models/users');

const deleteFile =  (filePath) =>{
    fs.unlink(filePath,(err)=>{       //deletes the file at the given location

        if(err){
            res.status(500).send("<html><h1>Server Down!</h1></html>")
        }
    })
}

exports.deleteFile = deleteFile;
