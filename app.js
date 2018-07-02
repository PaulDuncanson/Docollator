const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const userRoutes = require("./api/routes/users");
const docRoutes = require("./api/routes/docs");

var mongoDB = 'mongodb://127.0.0.1:27017/docrouter';
mongoose.connect(mongoDB);

// For clustered deployment on MongoDB Atlas:
//mongoose.connect(
//  "mongodb+srv://EndPointUser:2Connect!@cluster0-nh2iv.mongodb.net/test?retryWrites=true"
//);

mongoose.Promise = global.Promise;

app.use(morgan("dev"));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// End points
app.use("/users", userRoutes);
app.use("/docs", docRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;


/*  To convert to Restify replace Express with something like the following:
const config = require('./config');
const restify = require('restify');
const mongoose = require ('mongoose');
const restifyPlugins = restify.plugins;

const server = restify.createServer({
    name: config.name,
    version: config.version
});

server.use(restifyPlugins.jsonBodyParser({ mapParams: true}));
server.use(restifyPlugins.acceptParser(server.acceptable));
server.use(restifyPlugins.queryParser({ mapParams: true }));
server.use(restifyPlugins.fullResponse());

server.listen(config.port, () => {
	// establish connection to mongodb
    mongoose.Promise = global.Promise;
	mongoose.connect(config.db.uri);

	const db = mongoose.connection;

	db.on('error', (err) => {
	    console.error(err);
	    process.exit(1);
	});

	db.once('open', () => {
	    console.log(`Server is listening on port ${config.port}`);
	});
});
*/