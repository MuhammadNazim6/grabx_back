import { Request, Response } from "express";
import { Cart } from "../models/cart";

export const addToCart = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const userId = req.user?.id;

    if (!userId || !productId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const cart = await Cart.findOne({ userId });
    if (cart) {
      // Check if product already exists in cart
      const existingItem = cart.products.find(
        (prod) => prod.productId.toString() === productId
      );
      if (existingItem) {
        return res
          .status(200)
          .json({ message: "Product already added in cart", success: true });
      } else {
        cart.products.push({ productId, quantity: 1 });
      }
      await cart.save();
    } else {
      // Create new cart if it doesn't exist
      await Cart.create({
        userId,
        items: [{ productId, quantity: 1 }],
      });
    }

    res
      .status(201)
      .json({ message: "Item added to cart successfully", success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to add item to cart" });
  }
};

export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const userId = req.user?.id;

    if (!userId || !productId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const productIndex = cart.products.findIndex(
      (prod) => prod.productId.toString() === productId
    );
    if (productIndex === -1) {
      return res.status(404).json({ error: "Product not found in cart" });
    }

    cart.products.splice(productIndex, 1);
    await cart.save();

    res
      .status(200)
      .json({ message: "Item removed from cart successfully", success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove item from cart" });
  }
};

export const checkIfProductIsInCart = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const userId = req.user?.id;

    if (!userId || !productId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(200).json({ data: false });
    }

    const existingItem = cart.products.find(
      (prod) => prod.productId.toString() === productId
    );
    return res.status(200).json({ data: !!existingItem });
  } catch (error) {
    res.status(500).json({ error: "Failed to check cart" });
  }
};

export const getUserCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
console.log('✌️userId --->', userId);

    if (!userId) {
      return res.status(400).json({ error: "Missing user ID" });
    }

    const cart = await Cart.findOne({ userId }).populate("products.productId");
    if (!cart) {
      return res.status(200).json({ data: [] });
    }

    res.status(200).json({ data: cart.products });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cart" });
  }
};
