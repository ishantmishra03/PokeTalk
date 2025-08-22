import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors, { CorsOptions } from 'cors';
import cookieParser from 'cookie-parser';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

import connectDB from './config/db';
import authRouter from './routes/auth.routes';
import messageRouter from './routes/message.routes';
import { initializeSocket } from './sockets';

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

const whitelist: string[] = process.env.CORS_WHITELIST
  ? process.env.CORS_WHITELIST.split(',').map(origin => origin.trim())
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
app.use(express.json({limit: "10mb"}));

app.use('/api/auth', authRouter);
app.use('/api/message', messageRouter);

app.get('/', (_req: Request, res: Response) => {
  res.send('TypeScript Backend');
});

// Initialize socket.io server
export const io = new SocketIOServer(server, {
  cors: {
    origin: whitelist,
    credentials: true,
  },
});

initializeSocket(io);

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Failed to connect to DB:', err);
  });
