import express from "express"
const app = express()

import helmet from "helmet";
app.use(helmet())

import cors from 'cors'
app.use(cors({
    origin: true
}))

app.use(express.json())

import productsRouters from "./routers/productsRouter.js";
app.use(productsRouters);

import orderRouter from './routers/orderRouter.js'
app.use(orderRouter)

app.all("*", (req, res) => {
    res.status(404).send({ data: `Unsupported path ${req.path}`});
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, (res, req) => {
    console.log("Server is running on port", PORT);
});