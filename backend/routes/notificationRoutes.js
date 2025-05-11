const auth = require('../middleware/auth');

const router=require('express').Router();
const {getAdminNotification}=require('../controller/notification/notificationController');

router.get('/admin-notification',auth,getAdminNotification);

module.exports=router;
