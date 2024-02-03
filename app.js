const createError = require('http-errors');
const express = require('express');
const cors = require('cors')
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
var { expressjwt: jwt } = require("express-jwt");
const { jwtSecretKey } = require('./config/dbconfig');
const logger = require('morgan');

const routerRegister = require('./routes/routers.register')

const joi = require('joi')





const app = express();



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors())
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }))
// app.use(session({
//   secret: 'gendy No1 ^_^!',
//   resave: false,
//   saveUninitialized: true
// }))

app.use((req, res, next) => {
  res.cc = function (err, status = 1) {
    res.send({
      status,
      message: err instanceof Error ? err.message : err
    })
  }
  next()
})




app.use(express.static(path.join(__dirname, 'public')));




app.use(jwt({ secret: jwtSecretKey, algorithms: ["HS256"] }).unless({
  path: [/^\/openapi/]
}))


// 路由
routerRegister(app);



app.use((err, req, res, next) => {
  if (err instanceof joi.ValidationError) return res.cc(err)
  if (err.name === 'UnauthorizedError') return res.cc('无效token', 401)
  return res.cc(err)
});




app.use(function (req, res, next) {
  next(createError(404));
});


module.exports = app;
