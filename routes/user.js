const express = require('express')
const router = express.Router()

const {getUserById,getUser,updateUser,userPurchaseList} = require('../controllers/user')
const {isSignedIn,isAuthenticated,isAdmin} = require('../controllers/auth')

//param which works like customMiddlewares
router.param("userId",getUserById)

//getting the profile of the id
router.get('/user/:userId',isSignedIn,isAuthenticated,getUser)//doesnt matters what we write after :,it will be treated as value for param
//in this way we can secure a route by applying these custom middlewares.

//updating userInfo
router.put('/user/:userId',isSignedIn,isAuthenticated,updateUser)


//getting purchaseList
router.get('/order/user/:userId',isSignedIn,isAuthenticated,userPurchaseList)
module.exports = router