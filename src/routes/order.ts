import express from "express";
import { createOrder, handleCallback } from "../controllers/order";
import verifyToken from "../middlewares/auth";
const orderRoute = express();

orderRoute.post("/create-order", verifyToken, createOrder);
orderRoute.post("/callback", verifyToken, handleCallback);

export default orderRoute;
