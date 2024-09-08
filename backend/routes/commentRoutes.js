const {commentPost, removeComment, getAllComments } = require('../controller/comment/commentController');
const auth = require('../middleware/auth');


// import router
const router = require('express').Router();


// router handling
router.post('/add-comment',auth, commentPost);

router.get('/get-all-comments',getAllComments);
router.delete('/remove-comment',auth, removeComment)

module.exports = router;