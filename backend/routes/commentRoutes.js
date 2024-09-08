const {commentPost, removeComment, getAllComments, countCommentOfPost } = require('../controller/comment/commentController');
const auth = require('../middleware/auth');


// import router
const router = require('express').Router();


// router handling
router.post('/add-comment',auth, commentPost);

router.get('/get-all-comments',getAllComments);
router.get('/get-comment-count', countCommentOfPost)
router.delete('/remove-comment',auth, removeComment)

module.exports = router;