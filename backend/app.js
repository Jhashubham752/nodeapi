var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Import Body parser
var bodyParser = require('body-parser');
var cors = require('cors');

// Import Mongoose
var mongoose = require('mongoose');
var dotenv = require('dotenv');
dotenv.config();

//Import routes
var indexRouter = require('./routes/index');
var roleRouter = require('./routes/role');
var usersRouter = require('./routes/users');
var profileRouter = require('./routes/profile');
var categoryRouter = require('./routes/categories');
var subcategoryRouter = require('./routes/subcategories');
var productRouter = require('./routes/products');
var variantRouter = require('./routes/variant');
var settingRouter = require('./routes/setting');
var promocodeRouter = require('./routes/promocode');
var invoiceRouter = require('./routes/invoice');
var authRouter = require('./routes/auth');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ limit: '50mb', extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
  limit: "50mb",
  parameterLimit: 100000,
  extended: true
}));
app.use(bodyParser.json({limit: "50mb"}));

//database connect
mongoose.connect(process.env.MDB_CONNECT, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
const connection= mongoose.connection;
connection.once('open', () => {
	console.log("Mongodb database connection established successfully !!");
})

/* Routes api */
app.use('/', indexRouter);
app.use('/api', roleRouter);
app.use('/api', usersRouter);
app.use('/api', profileRouter);
app.use('/api', categoryRouter);
app.use('/api', subcategoryRouter);
app.use('/api', productRouter);
app.use('/api', variantRouter);
app.use('/api', settingRouter);
app.use('/api', promocodeRouter);
app.use('/api', invoiceRouter);
app.use('/api/auth', authRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
