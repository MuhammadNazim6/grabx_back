import mongoose, { Document, Schema } from 'mongoose';

interface IWishlistItem {
  productId: mongoose.Types.ObjectId;
  addedAt: Date;
}

interface IWishlist extends Document {
  userId: mongoose.Types.ObjectId;
  products: IWishlistItem[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  maxProducts: number;
}

const wishlistSchema = new Schema<IWishlist>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  products: [{
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    addedAt: {
      type: Date,
      default: Date.now,
    }
  }]
}, {
  timestamps: true
});

export const Wishlist = mongoose.model<IWishlist>('Wishlist', wishlistSchema);
