const { ProductCart, Order } = require("../models/order");

exports.getOrderById = (Request, Response, next, id) => {
   Order.findById(id)
      .populate("products.product", "name price") //2nd para is for teh fields we wanna bring in
      .exec((err, order) => {
         if (err) {
            return Response.status(400).json({
               error: "No such orders found",
            });
         }

         Request.order = order;
         next();
      });
};

exports.createOrder = (Request, Response) => {
   Request.body.order.user = Request.profile; //we have all the info of the order requested except the user info
   const order = new Order(Request.body.order);

   order.save((err, order) => {
      if (err) {
         return Response.status(400).json({
            error: "There was some problem in creating your order",
         });
      }

      return Response.json(order);
   });
};

exports.getAllOrders = (Request, Response) => {
   Order.find()
      .populate("user", "_id name")
      .exec((err, orders) => {
         if (err) {
            return Response.status(400).json({
               error: "No one has ordered anything yet.. ",
            });
         }

         return Response.json(orders);
      });
};

exports.getOrderStatus = (Request, Response) => {
   Response.json(Order.schema.path("status").enumValues);
};

exports.updateOrderStatus = (Request, Response) => {
   Order.update(
      { _id: Request.body.orderId },
      { $set: { status: Request.body.status } },
      (err, order) => {
         if (err) {
            return Response.status(400).json({
               error: "There was some problem in updation",
            });
         }
         Response.json(order);
      }
   );
};
