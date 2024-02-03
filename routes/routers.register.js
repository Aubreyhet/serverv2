const userRouter = require('./users')
const publicRouter = require('./openapi')
const goodsRouteer = require('./goods')
const importRouteer = require('./importapi')
const orderRouter = require('./orders')



const register = (app) => {
  app.use('/user', userRouter);
  app.use('/goods', goodsRouteer);
  app.use('/orders', orderRouter);


  app.use('/import', importRouteer)
  app.use('/openapi', publicRouter)
};

module.exports = register;
