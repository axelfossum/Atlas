const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

// Creating the express server
const app = express();
const port = process.env.PORT || 5000;

// Cors middleware
app.use(cors());
app.use(express.json());    // Allows us to parse json. Server will be receiving and sending json.

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
});

// Require router files
const tasksRouter = require('./routes/tasks');
const userRouter = require('./routes/userRouter');

// Use router middleware
app.use('/', tasksRouter);
app.use('/user', userRouter);

// Server starts listening on port
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});