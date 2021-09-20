const { Router } = require("express");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const ChatUser = require("../models/ChatUser");
const UserPhoto = require("../models/UserPhoto");
const router = Router();
const { LoginSchema } = require("../validationSchema/schema");
const { AuthSchema } = require("../validationSchema/schema");

const createName = async (userName, id = "") => {
  const newUserName = userName;
  userName += id;
  const candidate = await User.findOne({ userName });
  if (candidate) {
    return createName(newUserName, Number(id + 1));
  }
  return userName;
};

const logIn = async (res, email, password) => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User is not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid password, please try again" });
    }

    const token = jwt.sign({ userId: user.id }, config.get("jwtSecret"), {
      expiresIn: "21h",
    });
    return { token, userId: user.id };
  } catch (error) {}
};

router.post("/register", async (req, res) => {
  try {
    const { email, userName, password } = req.body;

    const result = await AuthSchema.validateAsync({
      username: userName,
      email: email,
      password: password,
    });

    const candidate = await User.findOne({ email });

    if (candidate) {
      return res.status(400).json({ message: "This user already exists" });
    }

    const newUserName = await createName(userName);

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      userName: newUserName,
      password: hashedPassword,
    });

    const userPhoto = new UserPhoto({
      email,
    });

    await user.save();
    await userPhoto.save();

    const idUser = await User.findOne({ email });

    const chatUser = new ChatUser({
      email,
      owner: idUser._id,
      userName: newUserName,
    });

    await chatUser.save();

    const token = await logIn(res, email, password);

    res.status(201).json({ message: "User created", ...token });
  } catch (e) {
    res.status(500).json({ message: "Something went wrong, please try again" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = LoginSchema.validateAsync({
      email: email,
      password: password,
    });

    const token = await logIn(res, email, password);

    res.json({ ...token });
  } catch (e) {
    res.status(500).json({ message: "Something went wrong, please try again" });
  }
});

module.exports = router;
