const mongoose = require('mongoose')
const crypto = require('crypto')
const uuidv1 = require('uuid/v1')

var userSchema = new mongoose.Schema ({
    name : { //creating objects
        type : String,
        required : true, 
        trim : true,
        maxlength : 32
    },
    lastName : {
        type : String,
        trim : true,
        maxlength : 32
    },
    email : {
        type : String,
        required : true,
        trim : true,
        unique : true
    },
    userinfo : {
        type : String,
        trim : true
    },
    encry_password : {
        type : String,
        required : true
    },
    salt : String,
    role : { //types of accounts like admin,user,technician
        type : Number, //higher the number , higher the privilages
        default : 0
    },
    purchase : {
        type : Array,
        default : [] //empty array
    }
},{timestamps : true}) //stores a time in DB, that when the data was feeded

userSchema.virtual("password") //we are creating a seperate field which will not be stored in DB
    .set(function(password) {
        this._password = password //stoirng the raw passwrd for future reference
        this.salt = uuidv1() //setting up the salt
        this.encry_password = this.passwordSecuring(password) //encrypting the password
    })
    .get(function(){
        return this._password
    })

userSchema.methods = {

    authenticate : function(plainpassword){
        return this.passwordSecuring(plainpassword) === this.encry_password //if the plain pass-
        //word matches with the password stored in DB in encryp form.
    },

    passwordSecuring : function(plainpassword){ //defining a function inside a method
        if(!plainpassword) return ""

        try {
            
            const hash = crypto.createHmac('sha256', this.salt) //using the crypto docu code & using salt instaed of secret
                   .update(plainpassword)
                   .digest('hex')

            return hash 

        } catch (error) {
            return ""
        }
    }
}

//command to make use of the Schema

module.exports = mongoose.model("User",userSchema) //argument1 what we want to call it as,
//argument2 the actual schema