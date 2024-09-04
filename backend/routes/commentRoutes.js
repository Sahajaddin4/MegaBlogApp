const {commentPost, removeComment } = require('../controller/comment/commentController');
const auth = require('../middleware/auth');


// import router
const router = require('express').Router();


// router handling
router.post('/add-comment',auth, commentPost);

router.delete('/remove-comment',auth, removeComment)

module.exports = router;