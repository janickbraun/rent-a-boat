const mongoose = require("mongoose")

const BoatSchema = new mongoose.Schema(
  {
    boatId: {
      type: String,
      required: true,
      unique: false,
    },
    boatName: {
      type: String,
      required: true,
    },
    inUse: {
      type: Boolean,
      default: false,
      required: true,
    },
    timeOfRent: {
      type: Date,
    },
    price: {
      type: Number,
      required: true,
    },
    ownerId: {
      type: String,
      required: true,
    },
  },
  {
    collection: "boats",
  }
)

const model = mongoose.model("BoatSchema", BoatSchema)

module.exports = model
