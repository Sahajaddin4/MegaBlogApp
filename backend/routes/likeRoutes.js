const { likePost, disLikePost } = require('../controller/like/likeController');


//import
const router=require('express').Router();


//Routes handleing
router.post('/post-like',likePost);

router.delete('/post-dislike',disLikePost);
//export like router
module.exports=router;
