import createError from 'http-errors';
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './api-docs-swagger.json';

import indexRouterV1 from './routes/v1/index';
import authRouterV1 from './routes/v1/auth';
import usersRouterV1 from './routes/v1/users';
import adminsRouterV1 from './routes/v1/admins';
import parcelsRouterV1 from './routes/v1/parcels';

const app = express();

dotenv.config();

app.use(session({
  secret: process.env.SECRET_KEY,
  resave: true,
  saveUninitialized: true,
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use(express.static(path.join(__dirname, '../UI')));

// api version 1

app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/v1', indexRouterV1);
app.use('/api/v1/auth', authRouterV1);
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
  res.send({
    message: err.message,
    error: err.status,
  });
  next();
});

export default app;
