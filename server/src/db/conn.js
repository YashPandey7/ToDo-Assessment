const mongoose = require("mongoose");
require("dotenv").config();
const MONGODB_URL = process.env.MONGODB_URL

console.log(MONGODB_URL)
mongoose.connect(MONGODB_URL)
.then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log("Error connecting to MongoDB: ", err);
});