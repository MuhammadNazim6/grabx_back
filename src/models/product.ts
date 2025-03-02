import { Schema, model, Document } from "mongoose";

interface IRating {
  userId: Schema.Types.ObjectId;
  rating: number;
  review?: string;
}

interface IProduct extends Document {
  _id: string;
  productName: string;
  description?: string;
  brand?: string;
  actualPrice: number;
  size: string;
  waist:string;
  length:string;
  images: string[];
  category: string;
  sellingPrice?: number;
  ratings: IRating[];
  stock: number;
  is_listed: boolean;
  offers: Schema.Types.ObjectId[];
  condition: number;
  createdAt: Date;
  updatedAt: Date;
}

const ratingSchema = new Schema<IRating>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String },
});

const productSchema = new Schema<IProduct>(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    actualPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    size: {
      type: String,
    },
    waist: {
      type: String,
    },
    length: {
      type: String,
    },
    images: {
      type: [String],
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    sellingPrice: {
      type: Number,
      min: 0,
    },
    ratings: [ratingSchema],
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    is_listed: {
      type: Boolean,
      default: true,
    },
    offers: [
      {
        type: Schema.Types.ObjectId,
        ref: "Offer",
      },
    ],
    condition: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ productName: 1, category_id: 1 });

const Product = model<IProduct>("Product", productSchema);

export default Product;
