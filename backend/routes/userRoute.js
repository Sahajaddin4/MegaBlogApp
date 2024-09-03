const { userSignup } = require("../controller/user/userController");


const router = require("express").Router();

router.post('/signup', userSignup)

module.exports = router;