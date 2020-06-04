const mongoose = require('mongoose')

const {ObjectId} = mongoose.Schema


const productCartSchema = new mongoose.Schema({ //instead of defining this schema in another file,
//and then use it here using objectid or ref , we are defining the schema in the same file
    product : {
        type : ObjectId,
        ref : "Product",
    },
    name : String,
    count : Number,
    price : Number
},{timestamps : true})

const orderSchema = new mongoose.Schema({
    product : [productCartSchema] , //cart has an array of products, and these products are different
    //than the product in DB , since they have additional properties like count
    transaction_id : {},
    amount : {
        type : Number
    },
    address : String,
    status : {
        type : String,
        default : "Recieved",
        enum : ["Cancelled","Delivered","Shipped","Processing","Recieved"]
    },
    updated : Date,
    user : {
        type : ObjectId,
        ref : "User"
    }
},{timestamps : true})

//now exporting the schemas

const ProductCart = mongoose.model("ProductCart",productCartSchema)
const Order = mongoose.model("Order",orderSchema)

module.exports = {ProductCart,Order}