import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    public_id: { type: String, required: true },
    size: { type: Number },
    type: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("File", fileSchema);