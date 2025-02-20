import express from "express";
import {
  addToCart,
  checkIfProductIsInCart,
  getUserCart,
  removeFromCart,
} from "../controllers/cart";
import verifyToken from "../middlewares/auth";
const cartRoute = express();

cartRoute.post("/add-to-cart/:productId", verifyToken, addToCart);
cartRoute.post("/remove-from-cart/:productId", verifyToken, removeFromCart);
cartRoute.post("/is-in-cart/:productId", verifyToken, checkIfProductIsInCart);
cartRoute.get("/user-cart", verifyToken, getUserCart);

export default cartRoute;
