import { Request, Response } from "express";
import { Wishlist } from "../models/wishlist";

export const addToWishList = async (req: Request, res: Response) => {
  try {
    const { productId } = req.body;
    const userId = req.user?.id; 

    if (!userId || !productId ) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const wishlist = await Wishlist.findOne({ userId });
    if (wishlist) {
      // Check if product already exists in wishlist
      const existingItem = wishlist.products.find(prod => prod.productId.toString() === productId);
      if (existingItem) {
        return res.status(200).json({ message: 'Product already added in wishlist' });
      } else {
        wishlist.products.push({ productId, addedAt: new Date()});
      }
      await wishlist.save();
    } else {
      // Create new wishlist if it doesn't exist
      await Wishlist.create({
        userId,
        products: [{ productId }]
      });
    }

    res.status(201).json({ message: 'Item added to wishlist successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add item to wishlist' });
  }
};

export const removeFromWishlist = async (req: Request, res: Response) => {
  try {
    const { productId } = req.body;
    const userId = req.user?.id;

    if (!userId || !productId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      return res.status(404).json({ error: 'Wishlist not found' });
    }

    const productIndex = wishlist.products.findIndex(prod => prod.productId.toString() === productId);
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found in wishlist' });
    }

    wishlist.products.splice(productIndex, 1);
    await wishlist.save();

    res.status(200).json({ message: 'Item removed from wishlist successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove item from wishlist' });
  }
};



