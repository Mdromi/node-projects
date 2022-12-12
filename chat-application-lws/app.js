// admin email: test1@test1.com, pas: Pas123&Pas123


// external imports
require('dotenv').config();
const cookieParser = require('cookie-parser');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

// internal imports
const {notFoundHandler, errorHandler} = require("./middleware/common/errorHandler");
const loginRouter = require('./router/loginRouter');
const userRouter = require('./router/userRouter');
const inboxRouter = require('./router/inboxRouter');

const app = express();

// request process 
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Setup View engine
app.set('view engine', 'ejs');
// app.set('views', 'views');

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// parse cookies
app.use(cookieParser(process.env.COOKIE_SECRET));


// routing setup
app.use('/', loginRouter);
app.use('/users', userRouter);
app.use('/inbox', inboxRouter);

// 404 not found handling
app.use(notFoundHandler);

// common error handler
app.use(errorHandler);


// database connection 
const MONGODB_URI = process.env.MONGO_CONNECTION_STRING;
const PORT = process.env.PORT || 4000;
mongoose.set('strictQuery', true);
mongoose
    .connect(MONGODB_URI, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true
    })
    .then(() => { 
        console.log('MongoDB connected...');
        app.listen(PORT, () => {
            console.log(`Server is listing on PORT ${PORT}`);
        })
    })
    .catch(e => {
        return console.log(e);
    }) 