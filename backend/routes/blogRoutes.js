const { createPost, getAllPosts, deletePost } = require('../controller/post/blogPost');
const auth = require('../middleware/auth');

//import 
const router=require('express').Router();

//Controller Import 


//Get Routes
router.get('/get-all-posts',getAllPosts);

//Post routes
router.post('/create-post',auth, createPost);

//Put routes


//Delete Routes
router.delete('/delete-post/:postId',auth,deletePost);



//export router
module.exports=router;

