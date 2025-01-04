const mongoose = require("mongoose");
const ArtCategory = require("./ArtCategories");

const productTypeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ArtCategory",
      required: true,
    },
    subCategory: {
      type: String,
      default: null, // Optional subcategory (e.g., 'Seascapes' under 'Landscapes')
    },
    attributes: {
      dominantColors: [String], // Primary colors for the product type
      techniques: [String], // List of techniques (e.g., 'Palette Knife')
      sizeOptions: [String], // Options like 'Small', 'Medium', 'Large'
      orientation: {
        type: String,
        enum: ["Portrait", "Landscape", "Square"],
        default: null,
      },
    },
  },
  { timestamps: true }
);

const ProductType = mongoose.model("ProductType", productTypeSchema);
module.exports = ProductType;
