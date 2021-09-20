const { Schema, model, Types } = require("mongoose");

const schema = new Schema({
  email: { type: String, required: true, unique: true },
  photo: { type: String, default: "" },
});

module.exports = model("UserPhoto", schema);
