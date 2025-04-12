const express = require("express");
const app = express();
const taskRouter = require("./src/routes/task.route");
require("dotenv").config();
const cors = require("cors");

app.use(cors());
app.use(express.urlencoded({extended : false}));
app.use(express.json());

app.use("/task", taskRouter);

module.exports = app;