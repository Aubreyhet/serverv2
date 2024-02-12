
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


app.use((req, res, next) => {
  if (!req.path.startsWith('/api_v1/')) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
  } else {
    next()
  }
});



app.use(jwt({ secret: jwtSecretKey, algorithms: ["HS256"] }).unless({
  path: [/^\/api_v1\/openapi/]
}))



app.use('/api_v1', routerRegister);




app.use((err, req, res, next) => {
  if (err instanceof joi.ValidationError) return res.cc(err)
  if (err.name === 'UnauthorizedError') return res.status(401).json({ message: '无效token', status: 1 });
  return res.cc(err)
});




app.use(function (req, res, next) {
  res.send({
    status: 1,
    message: '出错了'
  })
});

module.exports = app;
