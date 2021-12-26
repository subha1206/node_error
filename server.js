import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import AppError from './utils/appError.js';

import globalErrorHandler from './midd/error.js';

dotenv.config();

const app = express();

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.get('/', (req, res) => {
  res.send('hello');
});

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

mongoose.connect(process.env.DB_URL).then(() => {
  console.log('DB connection successful!');
  app.listen(process.env.PORT, () =>
    console.log('Express app running on ' + process.env.PORT)
  );
});
