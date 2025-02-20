import { Request, Response } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/order";
import { Cart } from "../models/cart";
import { Address } from "../models/address";

// Initialize Razorpay with environment variables
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { amount, currency = "INR", receipt = "receipt#1", notes } = req.body;

    // Validate required fields
    if (!amount) {
      return res.status(400).json({
        success: false,
        message: "Amount is required",
      });
    }

    // Create order
    const order = await razorpay.orders.create({
      amount: amount * 100, // Convert to smallest currency unit (paise)
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      notes: notes || {},
    });

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Error creating payment order:", error);
    res.status(500).json({
      success: false,
      message: "Error while creating payment order",
    });
  }
};

export const handleCallback = async (req: Request, res: Response) => {
  const userId = req.user?.id;
console.log('✌️userId --->', userId);

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } =
    req.body;
  const generated_signature = hmac_sha256(
    razorpay_order_id + "|" + razorpay_payment_id,
    process.env.RAZORPAY_KEY_SECRET as string
  );
  if (generated_signature === razorpay_signature) {
    const cart = await Cart.findOne({ userId }).populate<{
      products: { productId: { actualPrice: number }; quantity: number }[];
    }>({
      path: "products.productId",
      select: "actualPrice",
    });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }
    console.log("cart-cart-cart-cart:", cart.products[0].productId.actualPrice);

    const address = await Address.findOne({ userId, isDefault: true });

    const order = new Order({
      userId: userId,
      shippingAddress: address?._id,
      products: cart.products.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        sellingPrice: cart.products[0].productId?.actualPrice as number,
        ProductOrderStatus: "Pending",
      })),
      OrderStatus: "Placed",
      StatusLevel: 1,
      paymentStatus: "Paid",
      totalAmount: amount,
      paymentMethod: "Razorpay",
      trackId: razorpay_payment_id,
      notes: "Order placed via Razorpay",
    });

    await order.save();
    await Cart.findByIdAndDelete(cart._id);
    res.status(200).json({ success: true, message: "Order successfull" });
  }
};

function hmac_sha256(data: string, key: string): string {
  return crypto.createHmac("sha256", key).update(data).digest("hex");
}
