//All import here
const express=require('express');
const app=express();
const cors=require('cors');
const blogRoutes=require('./routes/blogRoutes');
const likeRoutes=require('./routes/likeRoutes');
const commentRoutes = require('./routes/commentRoutes');
const userRoute = require('./routes/userRoute');
const morgan=require('morgan');
const cookie = require("cookie-parser")
const fs=require('fs');
//env configaration done
require('dotenv').config();
const dbConnect=require('./config/db');
const path = require('path');

//All Logic here
dbConnect();

//Parsing json data  middleware
const logStreams=fs.createWriteStream(path.join(__dirname,'/System-logs/access.log'),{flags:'a'});
// Custom log format (JSON)
morgan.token('json', function (req, res) {
    return JSON.stringify({
      method: req.method,
      url: req.url,
      status: res.statusCode,
      responseTime: res.responseTime,
      date: new Date().toLocaleString(),
      ip: req.ip,
    });
  });
app.use(morgan(':json',{stream:logStreams}));
app.use(express.json());
app.use(cookie());
app.use(cors({
    origin:'*'
}));
//Routes mapping for blog
app.use('/blog/api',blogRoutes);
//Routes mapping for likes
app.use('/blog/api/like-dislike',likeRoutes);
// Routes mapping for comments
app.use('/blog/api/comment', commentRoutes);
// Route to delete comment

// Route for user
app.use('/blog/api/user', userRoute)

//Default route
app.get('/',(_,res)=>{
    res.send(`<h1>This is homepage</h1>`);
})



//server creation here
const PORT=process.env.PORT;
app.listen(PORT ||4000,(err)=>{
    console.log(`Server connected at port ${PORT}`);
});