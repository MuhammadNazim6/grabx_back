import mongoose, { Document } from "mongoose";

export interface IAddress extends Document {
  userId: mongoose.Types.ObjectId;
  fullName: string;
  mobile: string;
  addressLine1: string;
  addressLine2?: string;
  houseName?: string;
  landmark?: string;
  country: string;
  pincode: string;
  city: string;
  state: string;
  isDefault: boolean;
  addressType: "home" | "work" | "other";
  createdAt: Date;
  updatedAt: Date;
}

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    fullName: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    addressLine1: {
      type: String,
      required: true,
    },
    addressLine2: {
      type: String,
    },
    houseName: {
      type: String,
    },
    landmark: {
      type: String,
    },
    country: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    addressType: {
      type: String,
      enum: ["home", "work", "other"],
      default: "home",
    },
  },
  {
    timestamps: true,
  }
);

export const Address = mongoose.model<IAddress>("Address", addressSchema);
