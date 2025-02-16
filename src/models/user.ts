import mongoose, { Document, Schema } from "mongoose";

interface WalletHistory {
  type: string;
  amount: number;
  date: Date;
  reason: string;
}

interface Wallet {
  balance: number;
  history: WalletHistory[];
}

interface IUser extends Document {
  name: string;
  email: string;
  mobile: number;
  password: string;
  is_admin: number;
  is_email_verified: boolean;
  isBlocked: boolean;
  wallet: Wallet;
  refCode: string;
  isGoogle: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    mobile: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    is_admin: {
      type: Number,
      required: true,
      default: false
    },
    is_email_verified: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    wallet: {
      balance: {
        type: Number,
        default: 0,
      },
      history: [
        {
          type: {
            type: String,
          },
          amount: {
            type: Number,
          },
          date: {
            type: Date,
            default: Date.now,
            required: true,
          },
          reason: {
            type: String,
          },
        },
      ],
    },
    refCode: {
      type: String,
    },
    isGoogle: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>("User", userSchema);

