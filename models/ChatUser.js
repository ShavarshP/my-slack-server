const { Schema, model, Types } = require("mongoose");

const schema = new Schema({
  email: { type: String, required: true, unique: true },
  owner: { type: String, ref: "User" },
  userName: { type: String, required: true },
  chatDate: { type: String, default: "" },
});

module.exports = model("ChatUser", schema);
