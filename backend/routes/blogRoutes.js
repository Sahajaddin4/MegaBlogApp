const { createPost, getAllPosts, deletePost } = require('../controller/post/blogPost');

//import 
const router=require('express').Router();

//Controller Import 


//Get Routes
router.get('/get-all-posts',getAllPosts);

//Post routes
router.post('/create-post',createPost);

//Put routes


//Delete Routes
router.delete('/delete-post/:postId',deletePost);



//export router
module.exports=router;

