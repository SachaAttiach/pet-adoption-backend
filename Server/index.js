const express = require("express");
const app = express();
const petRoutes = require("./routes/pets");
const userRoutes = require("./routes/users");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
// require("./helpers/init_mongodb");

const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

//Middlewares
//body parser
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000"],
  })
);
app.use(cookieParser());

//import Routes
const authRoute = require("./routes/auth");

// Route middlewares
app.use("/api/user", authRoute);

//Routes that handle requests:
app.use("/pets", petRoutes);
app.use("/users", userRoutes);

//connecting to mongoose
mongoose.connect(process.env.DB_CONNECT);

app.listen(5000, () => {
  console.log("Server is running on port http://localhost:5000");
});
