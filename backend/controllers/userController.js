const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET, { expiresIn: "7d" });
};

// login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    // create token
    const token = createToken(user._id);

    res.status(200).json({ name: user.name, email, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// signup user
const signupUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.signup(name, email, password);

    // create a token
    const token = createToken(user._id);

    res.status(200).json({ name, email, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password"); // Exclude password field for security
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { loginUser, signupUser, getUsers };