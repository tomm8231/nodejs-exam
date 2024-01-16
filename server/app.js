import 'dotenv/config';

import express from 'express';

import session from 'express-session';

import http from 'http';

import { Server } from 'socket.io';

import helmet from 'helmet';

import cors from 'cors';

import { rateLimit } from 'express-rate-limit';

import { checkAuth } from './middelware/authMiddelware.js';

import handleSocket from './sockets/handleSocket.js';

import userRouters from './routers/usersRouter.js';

import productsRouters from './routers/productsRouter.js';

import orderRouter from './routers/ordersRouter.js';

import authRouter from './routers/authRouter.js';

import uploadsRouter from './routers/uploadsRouter.js';

import roundsRouter from './routers/roundsRouter.js';

import messaagesRouter from './routers/messagesRouter.js';

import downloadsRouter from './routers/downloadsRouter.js';

const app = express();
app.use(express.json());
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60, // 1 time
  },
});
app.use(sessionMiddleware);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['*'],
  },
});
app.use(helmet());
app.use(cors({
  origin: true,
  credentials: true,
}));

const allRoutesRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 200, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Use an external store for consistency across multiple server instances.
});

app.use(allRoutesRateLimiter);

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Use an external store for consistency across multiple server instances.
});
app.use(checkAuth);

io.on('connection', (socket) => {
  handleSocket(socket);
});

app.use('/auth', authRateLimiter);
app.use(userRouters);
app.use(productsRouters);
app.use(orderRouter);
app.use(authRouter);
app.use(uploadsRouter);
app.use(roundsRouter);
app.use(messaagesRouter);
app.use(downloadsRouter);

app.all('*', (req, res) => {
  res.status(404).send({ data: `Unsupported path ${req.path}` });
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log('Server is running on port', PORT);
});
