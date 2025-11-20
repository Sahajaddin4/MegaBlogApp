//All import here
const express=require('express');
const app=express();
const http=require('http');
const server=http.createServer(app);
const {Server}=require('socket.io');
const cors=require('cors');
//socket server
const io=new Server(server,{
  cors:{
    origin:'*'
  }
});

module.exports=io;

const blogRoutes=require('./routes/blogRoutes');
const notificationRoutes=require('./routes/notificationRoutes');
const likeRoutes=require('./routes/likeRoutes');
const commentRoutes = require('./routes/commentRoutes');
const userRoute = require('./routes/userRoute');
// const morgan=require('morgan');
const cookie = require("cookie-parser")
// const fs=require('fs');

//env configaration done
require('dotenv').config();
const dbConnect=require('./config/db');
const path = require('path');

//All Logic here
dbConnect();

// //Parsing json data  middleware
// let logFile=path.join(__dirname,'/System-logs/access.log')
// const logStreams=fs.createWriteStream(logFile,{flags:'a'});

// // Custom log format (JSON)

// morgan.token('json', function (req, res) {
//     return JSON.stringify({
//       method: req.method,
//       url: req.url,
//       status: res.statusCode,
//       responseTime: res.responseTime,
//       date: new Date().toLocaleString(),
//       ip: req.ip,
//     });
//   });

//   const clearLogFile = async () => {
//     try {
//       // Truncate the log file (clear content)
//       await fs.promises.truncate(logFile, 0);
      
//     } catch (err) {
//       console.error('Error clearing the log file:', err);
//     }
//   };
// const TIME_LIMIT=24*60*60*1000;
//   setInterval(()=>{
//     clearLogFile();
//   },TIME_LIMIT)
// app.use(morgan(':json',{stream:logStreams}));
app.use(express.json());
app.use(cookie());
// app.use(cors({
//     origin:'*'
// }));
//Routes mapping for blog
app.use('/blog/api',blogRoutes);
//Routes mapping for likes
app.use('/blog/api/like-dislike',likeRoutes);
// Routes mapping for comments
app.use('/blog/api/comment', commentRoutes);
// Route to delete comment

// Route for user
app.use('/blog/api/user', userRoute)

//route for notification
app.use('/blog/api/notification',notificationRoutes);
//Default route
app.get('/',(_,res)=>{
    res.send(`<h1>This is homepage</h1>`);
})

//Socket
io.on('connection', (socket) => {
  console.log('A user connected: ' + socket.id);
  socket.on('disconnect', () => {
    console.log('A user disconnected: ' + socket.id);
  });
});

//server creation here
const PORT=process.env.PORT;
server.listen(PORT ||4000,(err)=>{
    console.log(`Server connected at port ${PORT}`);
});