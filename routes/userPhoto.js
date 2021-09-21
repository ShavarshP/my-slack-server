const { Router } = require("express");
const UserPhoto = require("../models/UserPhoto");
const ChatUser = require("../models/ChatUser");
const auth = require("../middleware/auth.middleware");
const router = Router();

router.post("/save_photo", auth, async (req, res) => {
  try {
    const { email, photo } = req.body;
    await UserPhoto.updateOne(
      { email: email },
      { photo: JSON.stringify(photo) }
    );
    res.json({ message: "updated" });
  } catch (e) {
    res.status(500).json({ message: "Something went wrong, please try again" });
  }
});

router.get("/get_photo/:_id", auth, async (req, res) => {
  try {
    const id = req.params;
    const data = await ChatUser.findOne({ owner: id });
    const photo = await UserPhoto.findOne({ email: data.email });
    res.json(photo);
  } catch (e) {
    res.status(500).json({ message: "Something went wrong, please try again" });
  }
});

module.exports = router;
