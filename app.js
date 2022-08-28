const express = require('express');
const http = require('http');
const app = express();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use('/assets', express.static('assets')); //this should be above routes to prevent assets file from going to 404 error.

const routes = require('./router');
app.use("/", routes);

//setting mongoose for database
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const mongo_url = process.env.MONGO_URL;
try {
    mongoose.connect(mongo_url);
    console.log('Connected to Mongoose');
} catch (error) {
    console.log(err)
}

const server = http.createServer(app);
const { io } = require("./socket");
io.attach(server);
module.exports = app;

const port = process.env.PORT || 5000;
server.listen(port, () => {
    console.log('Server running at http://localhost:' + port);
});
app.locals.baseURL = "http://localhost:" + port;

