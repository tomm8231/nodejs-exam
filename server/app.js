import "dotenv/config"
import express from "express"

const app = express()

import session from "express-session";
const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { 
		secure: false,
		maxAge: 1000 * 60 * 60 //1 time		
		}
});
app.use(sessionMiddleware);

import http from "http";
import { Server } from "socket.io";

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ["*"],
    }
});

import helmet from "helmet";
app.use(helmet())

import cors from 'cors'
app.use(cors({
    origin: true,
	credentials: true
}))

app.use(express.json())

import { rateLimit } from 'express-rate-limit';

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

import { checkAuth } from "./middelware/authMiddelware.js";
app.use(checkAuth)

import handleSocket from "./sockets/handleSocket.js";
io.on("connection", handleSocket);

app.use("/auth", authRateLimiter);

import userRouters from "./routers/usersRouter.js";
app.use(userRouters);

import productsRouters from "./routers/productsRouter.js";
app.use(productsRouters);

import orderRouter from './routers/ordersRouter.js'
app.use(orderRouter)

import authRouter from "./routers/authRouter.js"
app.use(authRouter)

import uploadsRouter from "./routers/uploadsRouter.js"
app.use(uploadsRouter)

import roundsRouter from "./routers/roundsRouters.js"
app.use(roundsRouter)

import messaagesRouter from "./routers/messagesRouter.js"
app.use(messaagesRouter)

import downloadRouter from "./routers/downloadRouter.js"
app.use(downloadRouter)

app.all("*", (req, res) => {
    res.status(404).send({ data: `Unsupported path ${req.path}`});
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, console.log("Server is running on port", PORT));
