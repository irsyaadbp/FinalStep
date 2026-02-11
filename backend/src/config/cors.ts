import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const whitelist = (process.env.CORS_ORIGINS || '').split(',').map(origin => origin.trim());

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

export default corsOptions;
