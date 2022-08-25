const express = require("express");
const mongoose = require("mongoose");
const en = require("./constants");
require("dotenv").config();
//routers
const customerRouter = require("./routers/customerRouter");
const userRouter = require("./routers/userRouter");
const taskRouter = require("./routers/taskRouter");
const taskTypeRouter = require("./routers/taskTypeRouter");
const clientsRouter = require("./routers/clientRouter");
const utilitiesRouter = require("./routers/utilityRouter");

// express app
const app = express();

// connect to db
const dbURI = process.env.DATABASE_URI;
const port = process.env.PORT;

mongoose
  .connect(dbURI)
  .then((res) => {
    app.listen(port, () => {
      console.log(
        `${en.dbConnectionSuccess} Server is listening on port: ${port}.`
      );
    });
  })
  .catch((err) => console.log(`${en.dbConnectionErr} Error: `, err));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});

// static and middlewares
app.use(express.static("./public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/customers", customerRouter);
app.use("/users", userRouter);
app.use("/tasks", taskRouter);
app.use("/taskTypes", taskTypeRouter);
app.use("/clients", clientsRouter);
app.use("/utilities", utilitiesRouter);
