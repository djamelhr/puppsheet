// These are the Node.js modules used for this Express app.
// They are installed using NPM
var express = require("express");
var cors = require("cors");
var path = require("path");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");

// These are the modules that we write.
// They are specific to our application.
var index = require("./routes/index");
var conversions = require("./routes/users");

// This creates the Express app which is configured below.
var app = express();

// Set up the view engine.
// Views are in a folder called "views"
// Handlebars (hbs) is used for the templating engine.
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

// Standard Express stuff
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

// This configures the routes.
// Requests for the root folder are handled by the index module.
// Requests for the /api/conversions route are handle by the
// conversions module.
// These modules were added above.
app.use("/", index);
app.use("/users", conversions);
app.use("/sheetImage", require("./routes/imageRoutes"));

// All other requests are handled by the index module
app.use("*", index);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// Important later!  This exports the app object as a module.
// This comes into play when we deploy the application to
// Cloud Functions.
module.exports = app;
