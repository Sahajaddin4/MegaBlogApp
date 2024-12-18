const { userSignup, userLogin, getUsers, userSignUpByAdmin, removeUser, activateUser, logOut } = require("../controller/user/userController");
const auth=require("../middleware/auth");


const router = require("express").Router();
router.post('/add-by-admin/signup',auth, userSignUpByAdmin);
router.post('/signup', userSignup);
router.post('/login',userLogin);
router.put('/active-user/:id',auth,activateUser);
router.get('/get-users',auth,getUsers);
router.post('/log-out',auth,logOut);
router.delete('/delete-user/:id',auth,removeUser);
module.exports = router;