const { Schema, model, Types } = require("mongoose");

const schema = new Schema({
  owner: { type: String, ref: "User" },
  writers: { type: String, default: "" },
  readers: { type: String, default: "" },
  chatDate: { type: String, default: "" },
});

module.exports = model("Chat", schema);
