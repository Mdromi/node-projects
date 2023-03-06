require("dotenv").config();
const express = require("express");
const passport = require("passport");
const mongoose = require("mongoose");
var expressLayouts = require("express-ejs-layouts");
const path = require("path");
const session = require("express-session");
const flash = require("express-flash");
const MongoStore = require("connect-mongo");
const Emitter = require('events')

const app = express();
app.enable("trust proxy");
const MONGODB_URI = `mongodb://localhost:27017/realtime-pizza-order`;

// Event emitter
const eventEmitter = new Emitter();
app.set('eventEmitter', eventEmitter);

// Session store
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: MongoStore.create({
      mongoUrl: MONGODB_URI,
    }),
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    },
  })
);

// Passport config
const passportInit = require("./app/config/passport");
const { Socket } = require("socket.io");
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Global middleware
app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.user = req.user;
  next();
});

// Set Template engine
const viewsPath = path.join(__dirname, "/resources/views");

app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("views", viewsPath);
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

require("./routes/web")(app);


// Database Connection
mongoose.set("strictQuery", false);
const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(`Server is listing on PORT ${PORT}`);
});

mongoose
  .connect(MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("MongoDB connected...");
    server;
  })
  .catch((e) => {
    return console.log(e);
  });

// Socket
const io = require("socket.io")(server);
io.on('connection', (socket) => {
  // Join
  socket.on('join', (orderId) => {
    socket.join(orderId)
  })
})

eventEmitter.on('orderUpdated', (data) => {
  io.to(`order_${data.id}`).emit('orderUpdated', data)
})

eventEmitter.on('orderPlaced', (data) => {
  io.to('adminRoom').emit('orderPlaced', data)
})

