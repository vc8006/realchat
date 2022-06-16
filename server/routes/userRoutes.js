const express = require('express')
const router = express.Router();
const { protect }= require('../middleware/authMiddleware')

const {registerUser, authUser,allUser} = require('../controllers/userController')

router.route('/').post(registerUser).get(protect,allUser);
router.post('/login',authUser);

module.exports={router};