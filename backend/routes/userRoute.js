const { userSignup, userLogin, getUsers, userSignUpByAdmin } = require("../controller/user/userController");
const auth=require("../middleware/auth");


const router = require("express").Router();
router.post('/add-by-admin/signup',auth, userSignUpByAdmin);
router.post('/signup', userSignup);
router.post('/login',userLogin);
router.get('/get-users',auth,getUsers);
module.exports = router;