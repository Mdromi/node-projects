require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
var expressLayouts = require("express-ejs-layouts");
const path = require("path");
const session = require("express-session");
const flash = require("express-flash");
// const MongoStore = require("connect-mongo")
const MongoStore = require('connect-mongodb-session')(session);

const app = express();
const MONGODB_URI = `mongodb://localhost:27017/realtime-pizza-order`;

// Set Template engine
const viewsPath = path.join(__dirname, "/resources/views");

app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("views", viewsPath);
app.use(express.static(__dirname + "/public"));

require("./routes/web")(app);

// Session store
// const store = new MongoStore({
//     mongooseConnection: mongoose.connection,
//     uri: MONGODB_URI ,
//     collection:'sessions'
// })

// //express middleware
// app.use(session({
//     secret: process.env.COOKIE_SECRET,
//     resave: false,
//     saveUnitialized: false,
//     store: store,
//     cookie: { maxAge: 1000 * 60 * 60 * 24 },
// }))

// let mongoStore = new MongoStore({
//   mongooseConnection: mongoose.connection,
//   collection: "sessions",
// });

// // Session config
// app.use(
//   session({
//     secret: process.env.COOKIE_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     store: mongoStore,
//     cookie: { maxAge: 1000 * 60 * 60 * 24 },
//   })
// );

// Session store
let mongoStore = new MongoStore({
	mongooseConnection: mongoose.connection,
	collection: 'sessions'
});
app.use(session({
	secret: process.env.COOKIE_SECRET,
	resave: false,
	saveUninitialized: false,
	store: mongoStore,
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

app.use(flash());

// Database Connection
mongoose.set("strictQuery", false);
const PORT = process.env.PORT || 4000;
mongoose
  .connect(MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("MongoDB connected...");
    app.listen(PORT, () => {
      console.log(`Server is listing on PORT ${PORT}`);
    });
  })
  .catch((e) => {
    return console.log(e);
  });
