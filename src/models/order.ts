import mongoose, { Document, Schema } from 'mongoose';

interface IProduct {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  sellingPrice: number;
  ProductOrderStatus: string;
}

interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  shippingAddress: mongoose.Types.ObjectId;
  products: IProduct[];
  OrderStatus: string;
  StatusLevel: number;
  paymentStatus: string;
  orderDate: Date;
  totalAmount: number;
  paymentMethod: string;
  trackId: string;
  deliveredAt?: Date;
  cancelledAt?: Date;
  refundStatus?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  shippingAddress: {
    type: Schema.Types.ObjectId,
    ref: 'Address',
    required: true,
  },
  products: [{
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    sellingPrice: {
      type: Number,
      required: true
    },
    ProductOrderStatus: {
      type: String,
      required: true
    },
  }],
  OrderStatus: {
    type: String,
    required: true
  },
  StatusLevel: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    required: true
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true
  },
  trackId: {
    type: String,
    required: true
  },
  deliveredAt: {
    type: Date
  },
  cancelledAt: {
    type: Date
  },
  refundStatus: {
    type: String
  },
  notes: {
    type: String
  }
}, {
  timestamps: true 
});

const Order = mongoose.model<IOrder>('Order', orderSchema);

export default Order;