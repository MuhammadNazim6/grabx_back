import { Request, Response } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";

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
    console.log("✌️order --->", order);

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
  console.log("Reached here");
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;
  const generated_signature = hmac_sha256(
    razorpay_order_id + "|" + razorpay_payment_id,
    process.env.RAZORPAY_KEY_SECRET as string
  );
  if (generated_signature === razorpay_signature) {
    console.log("✌️razorpay_signature --->", razorpay_signature);
    console.log("✌️generated_signature --->", generated_signature);
    console.log("payment is successfull");
    res.status(200).json({ success: true });
  }
};

function hmac_sha256(data: string, key: string): string {
  return crypto.createHmac("sha256", key).update(data).digest("hex");
}
