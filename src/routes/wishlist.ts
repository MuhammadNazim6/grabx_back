import express from "express";
import { addToWishList, removeFromWishlist } from "../controllers/wishlist";
import verifyToken from "../middlewares/auth";
const wishlistRoute = express();

wishlistRoute.post("/add-to-wishlist", verifyToken, addToWishList);
wishlistRoute.post("/remove-from-wishlist", verifyToken, removeFromWishlist);

export default wishlistRoute;
