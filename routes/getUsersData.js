const { Router } = require("express");

const ChatUser = require("../models/ChatUser");
const auth = require("../middleware/auth.middleware");
const router = Router();

router.get("/is_auth/:_id", auth, async (req, res) => {
  try {
    const id = req.params;
    const data = await ChatUser.findOne({ owner: id });
    const allUser = await ChatUser.find();
    const allDataFilter = allUser
      .filter((item) => data.email !== item.email)
      .map((item) => {
        return { email: item.email, userName: item.userName };
      });
    res.json({ data, allDataFilter });
  } catch (e) {
    res.status(500).json({ message: "Something went wrong, please try again" });
  }
});

module.exports = router;
