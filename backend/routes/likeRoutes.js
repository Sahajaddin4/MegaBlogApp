const { likePost, disLikePost } = require('../controller/like/likeController');
const auth = require('../middleware/auth');


//import
const router=require('express').Router();


//Routes handleing
router.post('/post-like',auth, likePost);

router.delete('/post-dislike',auth,disLikePost);
//export like router
module.exports=router;
