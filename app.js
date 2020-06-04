//imports
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config(); //calling the .env file

//Calling My Routes
const authRoute = require("./routes/auth"); //importing the auth file
const userRoute = require("./routes/user");
const categoryRoute = require("./routes/category");
const productRoute = require("./routes/product");
const orderRoute = require("./routes/order");
const paymentBRoute = require("./routes/paymentBRoute");

const app = express();

//connecting the DB
mongoose
   .connect(process.env.DATABASE, {
      //creating a connection with the DB
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
   })
   .then(() => {
      console.log("THE DB IS ALSO CONNECTED BRO !");
   });

//PORT
const port = 8000;

//MiddleWares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//Routing or creating apis
app.use("/api", authRoute);
app.use("/api", userRoute);
app.use("/api", categoryRoute);
app.use("/api", productRoute);
app.use("/api", orderRoute);
app.use("/api", paymentBRoute);

//firing up the server
app.listen(port, () => {
   console.log(`the server is up and running at port ${port} bro!`);
});
