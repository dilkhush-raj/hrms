import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookiePraser from 'cookie-parser';
import {
  authRoutes,
  userRoutes,
  verifyRoutes,
  leaveRoutes,
  attendRoute,
} from './routes';

const app = express();

// App Setup
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://hrms-sand.vercel.app',
      'https://hrms.dilkhushraj.me',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  })
);

app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({extended: true, limit: '16kb'}));
app.use(express.json({limit: '16kb'}));
app.use(express.static('public'));
app.use(cookiePraser());

// Routes setup
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/verify', verifyRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/task', attendRoute);
app.use('/api/v1/leave', leaveRoutes);

// Health check
app.get('/ping', (req, res) => {
  res.status(200).json({success: true, message: 'pong'});
});

export {app};
