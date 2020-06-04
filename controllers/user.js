
const User = require('../models/user') 
const Order = require('../models/order')

//kinda middleware
exports.getUserById = (Request,Response,next,id) =>{ //to handle params, id comes from URL req , any variable followed by ':'

    User.findById(id).exec((err,user) =>{ //exec() is for excution after finding
        if(err || !user){
            return Response.json({
                error : "No such user found in our DB.."
            })
        }

        //means found
        Request.profile = user //filling up the profile of the req with the user

        //do not forget to miss this
        next() //params are middleWares and should be just after the use of the param
    })

}

exports.getUser = (Request,Response) =>{
    
    Request.profile.encry_password = undefined
    Request.profile.salt = undefined
    return Response.json(Request.profile)// profile section of the request has already been filled from findById
}


exports.updateUser = (Request,Response) =>{
    User.findByIdAndUpdate(
        {_id : Request.profile._id}, //compulsary syntax
        {$set : Request.body}, //what we really wanna change
        {new : true , useFindAndModify : false}, //compulsary syntax
        (error,user) =>{

            if(error || !user){
                return Response.status(400).json({
                    error : "error ! you cannot modify"
                })
            }

            user.encry_password = undefined //user does not a profile section , its just a set of json objects
            user.salt = undefined
            return Response.json(user) //sending back the updated user info
        }
    )
}


exports.userPurchaseList = (Request,Response) =>{

    Order.find({user : Request.profile._id}).populate("user","_id name")//whenever we reference to something from different collection we use populate
    .exec((err,order) =>{
        if(err || !order){
            return Response.status(400).json({
                error : "cannot find!"
            })
        }

        return Response.json(order)
    })
} //populate(a,b), a->the object to be updated , b->fields to bring in


exports.pushOrderInPurchaseList = (Request,Response,next) =>{//creating a middleware to fill in the purchases of the user model
    let purchases = [] //empty array
    Request.body.order.products.forEach(product =>{ //order is not Order(model) ,order comes from frontend, foreach is like loop

        purchases.push({
            _id : product._id,
            name : product.name,
            description : product.description,
            category : product.category,
            quantity : product.quantity,
            amount : Request.body.order.amount,
            transaction_id : Request.body.order.transaction_id
        })

    })
    // ^ we are filling in the array of objects(purchases) with the products from the the order(coming from frontend)
    
    //now we are going to push this purchases array into the User model
    User.findOneAndUpdate(
        {_id : Request.profile._id},
        {$push : {purchases : purchases}},//pushing local purchases into purchases of user model
        {new : true},
        (err,purchases) =>{
            if(err || !purchases){
                return Response.json({
                    error : "Cannot save the purchase list"
                })
            }

            next()
        }
    )
}