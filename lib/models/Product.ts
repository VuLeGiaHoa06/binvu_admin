import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    media: [String],
    category: String,
    collections: [{ type: mongoose.Schema.Types.ObjectId, ref: "Collection" }],
    tags: [String],
    sizes: [String],
    colors: [String],
    price: {
      type: mongoose.Schema.Types.Decimal128,
      get: (v: mongoose.Schema.Types.Decimal128) => {
        return parseFloat(v.toString());
      },
    },
    orgPrice: {
      type: mongoose.Schema.Types.Decimal128,
      set: (v: any) => {
        if (v === undefined || v === null) return undefined;
        return mongoose.Types.Decimal128.fromString(v.toString());
      },
      get: (v: mongoose.Schema.Types.Decimal128) => {
        if (!v) return null;
        return parseFloat(v.toString());
      },
    },
    expense: {
      type: mongoose.Schema.Types.Decimal128,
      get: (v: mongoose.Schema.Types.Decimal128) => {
        return parseFloat(v.toString());
      },
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { toJSON: { getters: true } }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;
