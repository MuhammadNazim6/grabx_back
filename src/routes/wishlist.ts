import express from "express";
import { addToWishList, removeFromWishlist } from "../controllers/wishlist";
const wishlistRoute = express();


wishlistRoute.post("/add-to-cart", addToWishList)
wishlistRoute.post("/remove-from-cart", removeFromWishlist)


export default wishlistRoute   