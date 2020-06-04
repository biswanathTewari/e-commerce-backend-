const express = require('express')
const router = express.Router()
const { signOut,signUp,signIn,isSignedIn } = require('../controllers/auth') //importing from controller files
const { check, validationResult } = require('express-validator'); //for express validator

//defining the response for every auth resquest


//signUp
router.post('/signUp',
    [
    check('name').isLength({min : 3}).withMessage('name should of atleast 3 letters'),
    check('email').isEmail().withMessage('whom are you fooling bro? try giving a valid email!'),
    check('password').isLength({min : 5}).withMessage('Password should be of atleast 5 characters')
    ],
signUp )//the middle array of parameters are validators acting as middlewares


//signIn
router.post('/signIn',
    [
    check('email').isEmail().withMessage('whom are you fooling bro? try giving a valid email!'),
    check('password').isLength({min : 5}).withMessage('Password should be of atleast 5 characters')
    ],
signIn )



//signOut
router.get('/signOut',signOut)

//testRoute
router.get('/isSignedIn',isSignedIn ,(Request,Response)=>{
    return Response.json(Request.auth)
})
//exporting 
module.exports = router