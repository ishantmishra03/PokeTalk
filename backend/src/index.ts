import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors, { CorsOptions } from 'cors';
import cookieParser from 'cookie-parser';

import connectDB from './config/db';
import authRouter from './routes/auth.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


const whitelist: string[] = process.env.CORS_WHITELIST
  ? process.env.CORS_WHITELIST.split(',').map((origin) => origin.trim())
  : [];


const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());


app.use('/api/auth', authRouter);


app.get('/', (_req: Request, res: Response) => {
  res.send('TypeScript Backend');
});


connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('❌ Failed to connect to DB:', err);
});