const mongoose = require("mongoose");

const artProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ArtCategory",
      required: true,
    },
    typeId: { type: mongoose.Schema.Types.ObjectId, ref: "ProductType", required: true },
    artistId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    price: { type: Number, required: true },
    images: [
      {
        url: { type: String },
        isThumbnail: { type: Boolean, default: false },
        colorPalette: [String],
      },
    ],
    filters: {
      emotions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Filter" }],
      styles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Filter" }],
      dominantColors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Filter" }],
    },
    trialRoomAssets: {
      roomViews: [{ type: String }],
      paintingDimensions: {
        width: { type: Number, required: true },
        height: { type: Number, required: true },
      },
      virtualPreviewAvailable: { type: Boolean, default: false },
    },
    customizationOptions: {
      isCustomizable: { type: Boolean, default: false },
      customTextAllowed: { type: Boolean, default: false },
      sizeOptions: [
        { width: { type: Number }, height: { type: Number }, additionalPrice: { type: Number, default: 0 } },
      ],
      frameOptions: [{ type: String, price: { type: Number } }],
    },
    dynamicPricing: {
      isDynamic: { type: Boolean, default: false },
      basePrice: { type: Number },
      factors: {
        demand: { type: Number, default: 1 },
        artistReputation: { type: Number, default: 1 },
      },
    },
    showcasing: { isFeatured: { type: Boolean, default: false }, bannerImage: { type: String } },
    afterSales: {
      warrantyPeriod: { type: Number, default: 0 },
      returnPolicy: { type: String, default: "" },
    },
    deliveryDetails: {
      shippingCost: { type: Number, default: 0 },
      estimatedDeliveryTime: { type: Number, default: 7 },
      packagingOptions: [{ type: String, additionalCost: { type: Number } }],
    },
    reviews: [{ userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, rating: { type: Number, min: 1, max: 5 }, comment: { type: String }, createdAt: { type: Date, default: Date.now } }],
    testimonials: [{ customerName: { type: String }, comment: { type: String }, createdAt: { type: Date, default: Date.now } }],
    giftingOptions: { isGiftable: { type: Boolean, default: false }, personalizedMessage: { type: String, default: "" } },
    verification: { isVerified: { type: Boolean, default: false }, verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, comments: { type: String, default: "" } },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
