import express from "express";
import { addToWishList, removeFromWishlist } from "../controllers/wishlist";
const wishlistRoute = express();


wishlistRoute.post("/add-to-wishlist", addToWishList)
wishlistRoute.post("/remove-from-wishlist", removeFromWishlist)


export default wishlistRoute   