const mongoose = require("mongoose");

const artCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" }, // Description for the category
    managedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const ArtCategory = mongoose.model("ArtCategory", artCategorySchema);
module.exports = ArtCategory;
