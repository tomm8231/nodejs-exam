import "dotenv/config.js"
import express from "express"
const app = express()

import helmet from "helmet";
app.use(helmet())

import cors from 'cors'
app.use(cors({
    origin: true
}))

app.use(express.json())

import session from "express-session"
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }))

const checkAuth = (req, res, next) => {
	if (req.session && req.session.userId) {
		return next()
	} else {
		return res.status(401).send({ data: "Unauthorised" })
	}
}


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

app.use("/auth", authRateLimiter);

import userRouters from "./routers/usersRouter.js";
app.use(userRouters);

import productsRouters from "./routers/productsRouter.js";
app.use(productsRouters);

import orderRouter from './routers/ordersRouter.js'
app.use(orderRouter)

import authRouter from "./routers/authRouter.js"
app.use(authRouter)

app.all("*", (req, res) => {
    res.status(404).send({ data: `Unsupported path ${req.path}`});
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, (res, req) => {
    console.log("Server is running on port", PORT);
});