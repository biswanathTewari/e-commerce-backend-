const User = require('../models/user') //importing the user model
const { check, validationResult } = require('express-validator'); //for express validator
const jwt = require('jsonwebtoken') //express jsonwebtoken
const expressJwt = require('express-jwt') //express jwt

//SignUp
exports.signUp = (Request,Response) =>{

    const errors = validationResult(Request) //binds together req and error

    if(!errors.isEmpty()){
        return Response.status(422).json({
            error : errors.array()[0].param,
            message : errors.array()[0].msg //converting the errors into array then accessing the first index
        })
    }

    const user = new User(Request.body) //creating an object of the class User with values from req.body
    user.save((err,user) =>{ //saving the user along with callback function for response
        if(err){
            return Response.status(400).json({
                err : "not  able to save bro"
            })
        }
        Response.json({ //sending a response if all okay !
            name : user.name,
            email : user.email,
            id : user._id
        })
    })
}


//signIn
exports.signIn = (Request,Response) =>{
    const{email,password} = Request.body

    const errors = validationResult(Request) //binds together req and error

    if(!errors.isEmpty()){
        return Response.status(422).json({
            error : errors.array()[0].param,
            message : errors.array()[0].msg //converting the errors into array then accessing the first index
        })
    }

    User.findOne({email},(err,user) =>{ //in User schema we are finding the first object wd dis email,and in callback func we get teo para. err if cudnt find it and user is the object if we found it.

        if(err || !user){
            return Response.status(400).json({
                error : "NO USER FOUND UNDER THIS EMAIL"
            })
        }

        if(!user.authenticate(password)){ //if the password does not match, the authenticate method comes from user schema model.
            return Response.status(401).json({
                error : "incorrect password bro! try again.."
            })
        }

        //creating token using jsonwebtoken
        const token = jwt.sign({_id : user._id},process.env.SECRET)

        //puting the token in cookie
        Response.cookie("token",token,{expire : new Date() + 999})
        //cookie is key value pair - we send two fields .. "token" and its corresponding values and the expiry
        
        //sending a response to the frontend
        const {_id,name,email,role} = user
        Response.json({ token, user: {_id,name,email,role} })
    })
}

//signOut
exports.signOut = (Request,Response) =>{
    Response.clearCookie("token")
    Response.json({//creating objects to be passed as json response
        message : 'Byee.. hope to see you soon'
    })
}


//protectedRoutes
exports.isSignedIn = expressJwt({ //it is a builtIn middleware, we are just using it to check if the route request has a valid token or not
    secret : process.env.SECRET , 
    userProperty : "auth" //naming the property
})//since this is a built in middleware, we dont need to include next()


//Custom Middlewares
exports.isAuthenticated = (Request,Response,next) =>{
    let checker = Request.profile && Request.auth && Request.profile._id == Request.auth._id
    //here profile is a property created from the frontend for a user
    if(!checker){
        return Response.status(403).json({
            error : "ACCESS DENIED !!"

        })
    }

    next()
}//just a side note: req.profile comes from param(getuserId) and auth comes from inbuilt middleware jwt or rather the token provided by the frontend

exports.isAdmin = (Request,Response,next) =>{
    if(Request.profile.role == 0){
        return Response.status(403).json({
            error : "ACCESS DENIED ! You are not loggedIn as an Admin.."
        })
    }
    next()
}