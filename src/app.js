import createError from 'http-errors';
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import indexRouter from './routes/index';
import usersRouter from './routes/users';
import adminsRouter from './routes/admins';
import parcelsRouter from './routes/parcels';

import indexRouterV1 from './routes/v1/index';
import usersRouterV1 from './routes/v1/users';
import adminsRouterV1 from './routes/v1/admins';
import parcelsRouterV1 from './routes/v1/parcels';

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'UI/views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'UI')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admins', adminsRouter);
app.use('/parcels', parcelsRouter);

// api version 1
app.use('/api/v1', indexRouterV1);
app.use('/api/v1/users', usersRouterV1);
app.use('/api/v1/admins', adminsRouterV1);
app.use('/api/v1/parcels', parcelsRouterV1);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {});
  next();
});

export default app;