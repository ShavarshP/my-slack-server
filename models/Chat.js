const { Schema, model, Types } = require("mongoose");

const schema = new Schema({
  chatName: { type: String, default: "" },
  chatDate: { type: String, default: JSON.stringify([]) },
});

module.exports = model("Chat", schema);
