const Category = require('../models/category')

exports.getCategoryById = (Request,Response,next,id) =>{

    Category.findById(id).exec((err,cate) =>{
        if(err || !cate){
            return Response.status(400).json({
                error : "Cannot find the specified the category."
            })
        }

        Request.category = cate
        next()
    })

}

exports.createCategory = (Request,Response) =>{
    const category = new Category(Request.body) //creating an object of the class/model

    category.save((err,cate) =>{
        if(err || !cate){
            return Response.status(400).json({
                error : "Cannot create the category"
            })

        }
        Response.json(cate)
    })
}


exports.getCategory = (Request,Response) =>{
    return Response.json(Request.category)
}

exports.getCategories = (Request,Response) =>{

    Category.find().exec((err,categories) =>{
        if(err || !categories){
            return Response.status(400).json({
                error : "No categories found"
            })
        }

        return Response.json(categories)
    })
}


exports.updateCategory = (Request,Response) =>{
    const category = Request.category
    category.name = Request.body.name//since we have only one field in this schema, we are not going by transitional way
    
    category.save((err,cate) =>{
        if(err){
            return Response.status(400).json({
                error : "Sorry! Updation was not successful.."
            })
        }

        Response.json(cate)
    })
}


exports.removeCategory = (Request,Response) =>{

    const category = Request.category //req.category is a sec of req we created & const category is an object of the class Category

    category.remove((err,cate) =>{
        if(err){
            return Response.status(400).json({
                error : `Sorry! there was some problem in deleting ${cate.name} category`
            })
        }

        return Response.json({
            message : `${cate.name} category was successfully deleted`
        })
    })//provided by mongoose
}