const express = require('express')
const router = express.Router()
const {isSignedIn,isAuthenticated,isAdmin} = require('../controllers/auth')
const {getUserById} = require('../controllers/user')
const {getProductById,createProduct,getProduct,getPhoto,updateProduct,deleteProduct,getAllProducts,getAllCategories} = require('../controllers/product')


//params
router.param('userId',getUserById)
router.param('productId',getProductById)


//routes
router.post('/product/create/:userId',isSignedIn,isAuthenticated,isAdmin,createProduct)
router.get('/product/:productId',getProduct)

//updateRoute
router.put('/product/:productId/:userId',isSignedIn,isAuthenticated,isAdmin,updateProduct)

//deleteRoute
router.delete('/product/:productId/:userId',isSignedIn,isAuthenticated,isAdmin,deleteProduct)

//listing
router.get('/products',getAllProducts)

//getting all the categories
router.get('/products/categories',getAllCategories)

//middlewares
router.get('/product/photo/:productId',getPhoto)

module.exports = router
