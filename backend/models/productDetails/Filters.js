const filterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ["Emotion", "Style", "Color"],
      required: true,
    },
  });
  
  const Filter = mongoose.model("Filter", filterSchema);
  module.exports = Filter;
  