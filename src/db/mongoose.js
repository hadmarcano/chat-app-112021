require('dotenv').config();
const mongoose = require("mongoose");

mongoose
    .connect(process.env.MONGODB_URL,{
    useCreateIndex: true,
    userNewUrlParser: true,
    useUnifiedTopology: true,
        useFindAndModify: false,
    })
    .then(() => {
        console.log("Database is conected")
    })
    .catch((e) => {
        console.log("Cannot connect to database :", e);
    })
     