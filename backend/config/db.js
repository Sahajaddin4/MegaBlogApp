
function dbConnect() {
    const mongoose = require('mongoose');
    require('dotenv').config();
    const url = process.env.DB_URL;
    mongoose.connect(url).then(()=>{
        console.log("Database Connection successful");        
    }).catch((error)=>{
        console.error(error);
        
        console.log('Failed to establish DB connection');
    });

}

module.exports=dbConnect;