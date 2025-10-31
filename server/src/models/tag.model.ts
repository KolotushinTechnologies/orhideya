import mongoose, { Document, Schema } from 'mongoose';

export interface ITag extends Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const TagSchema = new Schema<ITag>(
  {
    name: {
      type: String,
      required: [true, 'Please add a tag name'],
      unique: true,
      trim: true,
      maxlength: [30, 'Name cannot be more than 30 characters'],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITag>('Tag', TagSchema);
