import express from "express";
import { createOrder, handleCallback } from "../controllers/order";
const orderRoute = express();

orderRoute.post("/create-order", createOrder);
orderRoute.post("/callback", handleCallback);

export default orderRoute;
