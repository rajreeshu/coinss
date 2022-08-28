const router = require('express').Router();
const userController = require('./controller/userController');
const apiController = require('./controller/api');

//image upload functions
var multer = require('multer');
var storage = multer.diskStorage({
   destination: function (req, file, cb) {
       cb(null, __dirname+'/assets/uploads');
   },
   filename:function (req, file, cb) {
       cb(null,Date.now()+"_"+file.originalname);
   }
});
const fileFilter = (req, file, cb) => {
   if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
       cb(null, true);
   } else {
       cb(null, false);
   }
}

var upload = multer({
   storage: storage,
   fileFilter: fileFilter
})


//page routers
router.get('/',userController.home); //checked54
router.get('/product',userController.product); //checked54
router.get('/login',userController.login);
router.get('/signup',userController.signup);
router.get('/account',userController.account);
router.get("/favourites",userController.favourites);

router.get('/chat',userController.chatHome);

// admin page routes
router.get('/admin',userController.admin);
router.post('/admin/product',upload.single('profileImg'), apiController.admin_addProduct);

// api routes

   // login
router.post('/api/signup_form',apiController.signup_form);
router.post('/api/login_form',apiController.login_form);
router.get('/api/get_userID/:email',apiController.get_userID);

   //product
// router.post('/api/product',apiController.insert_product);
router.post('/api/homeProduct',apiController.all_products);
router.get('/api/oneProduct/:productId/:email',apiController.one_product);
router.post('/api/userProduct',apiController.userProducts);
router.patch('/api/addRemoveFavourite/:email',apiController.addRemoveFavourite);
router.get('/api/getFavourites/:email',apiController.getFavourites);
router.post('/api/review',apiController.insertReview);
router.get('/api/review/:productId',apiController.getReview);
//image upload routes

// payment gateway routes
router.post('/payment/createOrder',apiController.createOrder);


// chat apis
router.get('/chat/users', apiController.getUsers);
router.get('/chat/chat/:senderMail/:receiverId', apiController.getChat);
router.post('/chat/chat', apiController.postChat);

// 404 error page
router.get('*',userController.error404);

module.exports = router;