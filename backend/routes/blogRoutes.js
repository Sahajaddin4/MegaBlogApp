const { createPost, getAllPosts, deletePost, postApprove, postReject, getMyBlogs, approveRejectedPost, getOneBlog } = require('../controller/post/blogPost');
const auth = require('../middleware/auth');

//import 
const router=require('express').Router();

//Controller Import 


//Get Routes
router.get('/get-all-posts/:id',getAllPosts);
router.get('/get-my-blogs/:id',auth,getMyBlogs);
router.get('/get-blog/:id',auth,getOneBlog);
//Post routes
router.post('/create-post',auth, createPost);

//Put routes
router.put('/rejected-blog-approve/:id',auth,approveRejectedPost);
router.put('/blog-approved/:id',auth,postApprove);
router.put('/blog-rejected/:id',auth,postReject);
//Delete Routes
router.delete('/delete-post/:postId',auth,deletePost);



//export router
module.exports=router;

