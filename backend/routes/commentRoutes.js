const {commentPost, removeComment } = require('../controller/comment/commentController');


// import router
const router = require('express').Router();


// router handling
router.post('/add-comment', commentPost);

router.delete('/remove-comment', removeComment)

module.exports = router;