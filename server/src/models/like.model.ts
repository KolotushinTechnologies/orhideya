import mongoose, { Schema, Document } from 'mongoose';

export interface ILike extends Document {
  productId: mongoose.Types.ObjectId;
  ipAddress: string;
  createdAt: Date;
}

const LikeSchema: Schema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  ipAddress: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create compound index to ensure one like per IP per product
LikeSchema.index({ productId: 1, ipAddress: 1 }, { unique: true });

export default mongoose.model<ILike>('Like', LikeSchema);
