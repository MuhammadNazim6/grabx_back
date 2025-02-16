import mongoose, { Document } from "mongoose";

interface ICartProduct {
  productId: mongoose.Types.ObjectId;
  quantity: number;
}

interface ICart extends Document {
  userId: mongoose.Types.ObjectId;
  products: ICartProduct[];
  createdAt: Date;
  updatedAt: Date;
}

const cartSchema = new mongoose.Schema<ICart>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1,
          max: 10,
        },
      },
    ],
  },
  { timestamps: true }
);

export const Cart = mongoose.model<ICart>("Cart", cartSchema);
