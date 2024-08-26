//All import here
const express=require('express');
const app=express();

const blogRoutes=require('./routes/blogRoutes');
const likeRoutes=require('./routes/likeRoutes');

//env configaration done
require('dotenv').config();
const dbConnect=require('./config/db');

//All Logic here
dbConnect();

//Parsing json data  middleware
app.use(express.json());
//Routes mapping for blog
app.use('/blog/api',blogRoutes);
//Routes mapping for likes
app.use('/blog/api/like-dislike',likeRoutes);
//Default route
app.get('/',(_,res)=>{
    res.send(`<h1>This is homepage</h1>`);
})



//server creation here
const PORT=process.env.PORT;
app.listen(PORT ||4000,(err)=>{
    console.log(`Server connected at port ${PORT}`);
    
});