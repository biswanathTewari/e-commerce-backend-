const Product = require("../models/product");
const formidable = require("formidable");
const fs = require("fs"); //file system for extracting the path of the image
const _ = require("lodash");

exports.getProductById = (Request, Response, next, id) => {
   Product.findById(id)
      .populate("category")
      .exec((err, product) => {
         if (err || !product) {
            return Response.status(400).json({
               error: "No such product found in our DB!",
            });
         }

         Request.product = product;
         next();
      });
};

exports.createProduct = (Request, Response) => {
   let form = new formidable.IncomingForm();
   form.keepExtensions = true;

   form.parse(Request, (err, fields, files) => {
      if (err) {
         return Response.status(400).json({
            error: "The file format is not supported.",
         });
      }

      //Destructuring

      const { name, description, price, category, stock } = fields;

      if (!name || !description || !price || !category || !stock) {
         return Response.status(400).json({
            error: "Please include all the fields",
         });
      }

      let product = new Product(fields);
      //handling the file

      if (files.photo) {
         if (files.photo.size > 5000000) {
            return Response.json({
               error: "the photo size should not be greater than 3MB",
            });
         }

         product.photo.data = fs.readFileSync(files.photo.path); //feeding the path to the doc to the DB object
         product.photo.contentType = files.photo.type;
      }

      //saving the product in the DB
      product.save((err, prod) => {
         if (err) {
            return Response.status(400).json({
               error: "There was some problem in uploading the product",
            });
         }

         Response.json(product);
      });
   });
}; //with fields comes texts doc and with files comes the pic,mp3 etc..

exports.getProduct = (Request, Response) => {
   Request.product.photo = undefined;
   return Response.json(Request.product);
};

exports.getPhoto = (Request, Response, next) => {
   if (Request.product.photo.data) {
      Request.get("Content-Type", Request.product.photo.contentType);
      return Response.send(Request.product.photo.data);
   }
   next();
};

exports.deleteProduct = (Request, Response) => {
   let product = Request.product;
   product.remove((err, deleted) => {
      if (err) {
         return Response.status(400).json({
            error: "There was some problem in deleting..",
         });
      }

      return Response.json({
         message: "Deletion successfull!",
         deleted,
      });
   });
};

exports.updateProduct = (Request, Response) => {
   let form = new formidable.IncomingForm();
   form.keepExtensions = true;

   form.parse(Request, (err, fields, files) => {
      if (err) {
         return Response.status(400).json({
            error: "The file format is not supported.",
         });
      }

      let product = Request.product;
      product = _.extend(product, fields); //here we use lodash to update the feilds in the exisiting object

      //handling the file

      if (files.photo) {
         if (files.photo.size > 5000000) {
            return Response.json({
               error: "the photo size should not be greater than 3MB",
            });
         }

         product.photo.data = fs.readFileSync(files.photo.path); //feeding the path to the doc to the DB object
         product.photo.contentType = files.photo.type;
      }

      //saving the product in the DB
      product.save((err, prod) => {
         if (err) {
            return Response.status(400).json({
               error: "There was some problem in updating the product",
            });
         }

         Response.json(product);
      });
   });
};

exports.getAllProducts = (Request, Response) => {
   let limit = Request.query.limit ? parseInt(Request.query.limit) : 8; //if there is a limit in the request query then we use that else we use the default
   let sortBy = Request.query.sortBy ? Request.query.sortBy : "_id"; //default is by _id

   Product.find()
      .select("-photo") //to stop photo field to be fetched
      .populate("category")
      .sort([[sortBy, "asc"]]) //sorting the products based on sortBy in asc order
      .limit(limit) //limiting the no of products
      .exec((err, products) => {
         if (err) {
            return Response.status(400).json({
               error: "No products available at the moment",
            });
         }

         return Response.json(products);
      });
};

exports.getAllCategories = (Request, Response) => {
   Product.distinct("category", {}, (err, category) => {
      if (err) {
         return Response.status(400).json({
            error: "Could not fetch the categories",
         });
      }

      Response.json(category);
   });
};

//creating a middleware for stock and sold loving relation
exports.updateStock = (Request, Response, next) => {
   let Operations = Request.body.order.products.map((prod) => {
      return {
         updateOne: {
            filter: { _id: prod._id }, //filtering out on the basis of the current product from the model of product
            update: { $inc: { stock: -prod.count, sold: +prod.count } },
         },
      };
   });

   Product.bulkWrite(Operations, {}, (err, products) => {
      if (err) {
         return Response.status(400).json({
            error: "there was some problem with bulkwrite",
         });
      }

      next();
   });
};
