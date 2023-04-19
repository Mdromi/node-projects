const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const tasks = require("./routes/tasks");
const notFound = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const connectDB = require('./db/connect')
require('dotenv').config();

const app = express();

// middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.static('./public'));
app.use(express.json());


// routes
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "OK" });
});
app.use('/api/v1/tasks', tasks);

 app.use(notFound);
 app.use(errorHandlerMiddleware);


// create server and connect db
const port = process.env.PORT || 4000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
      console.log(`localhost: ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

start();
