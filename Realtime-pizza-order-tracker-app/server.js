const express = require('express')
const mongoose = require('mongoose')
const ejs = require('ejs')
var expressLayouts = require('express-ejs-layouts');
const path = require('path')

const app = express()

// Set Template engine
const viewsPath = path.join(__dirname, '/resources/views')

app.set('view engine', 'ejs')
app.use(expressLayouts) 
app.set('views', viewsPath)
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.render('home')
})

















mongoose.set('strictQuery', false)
const MONGODB_URI = `mongodb://localhost:27017/realtime-pizza-app`;
const PORT = process.env.PORT || 4000;
mongoose
    .connect(MONGODB_URI, { 
        useNewUrlParser: true, 
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