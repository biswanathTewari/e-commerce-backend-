const express = require('express')
const router = express.Router()


const {getCategoryById,createCategory,getCategory,getCategories,updateCategory,removeCategory} = require('../controllers/category')
const {getUserById} = require('../controllers/user')
const {isAdmin,isSignedIn,isAuthenticated} = require('../controllers/auth')


//params
router.param("userId",getUserById)
router.param("categoryId",getCategoryById)

//creating the actual routes


//creating
router.post('/category/create/:userId',isSignedIn,isAuthenticated,isAdmin,createCategory)


//reading
router.get('/category/:categoryId',getCategory)
router.get('/categories',getCategories)


//Updating
router.put('/category/:categoryId/:userId',isSignedIn,isAuthenticated,isAdmin,updateCategory)


//deleting
router.delete('/category/:categoryId/:userId',isSignedIn,isAuthenticated,isAdmin,removeCategory)


module.exports = router
