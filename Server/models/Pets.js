const mongoose = require("mongoose");

const petSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  adoptionStatus: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
    required: true,
  },
  height: {
    type: String,
    required: true,
  },
  weight: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
  hypoallergenic: {
    type: Boolean,
    required: true,
  },
  dietery: {
    type: Array,
    required: false,
  },
  breed: {
    type: String,
    required: true,
  },
  savedStatus: {
    type: String,
    required: false,
  },
});

const PetModel = mongoose.model("Pet", petSchema);

module.exports = PetModel;
