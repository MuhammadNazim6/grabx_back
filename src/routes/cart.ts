import express from "express";
import { addToCart, checkIfProductIsInCart, getUserCart, removeFromCart } from "../controllers/cart";
const cartRoute = express();


cartRoute.post("/add-to-cart/:productId", addToCart)
cartRoute.post("/remove-from-cart/:productId", removeFromCart)
cartRoute.post("/is-in-cart/:productId", checkIfProductIsInCart)

cartRoute.get("/user-cart", getUserCart)


export default cartRoute   