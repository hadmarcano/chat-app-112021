require("./db/mongoose");
require('dotenv').config()
const express = require("express");
const morgan = require("morgan");



// Import Routes
//

// App-express
const app = express();
app.use(express.static('public'));
// const router = express.Router();

// Middlewares


app.use(express.json());
app.use(morgan("dev"));

// Router Middlewares
app.use('/static', express.static('public'));



// App Listen
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`app is linten on port number: ${port}`);
})