const {commentPost } = require('../controller/comment/commentController');

// import router
const router = require('express').Router();


// router handling
router.post('/', commentPost);

module.exports = router;