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

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  let emptyFields = [];

  if (!name) emptyFields.push("name");

  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill in all the fields!", emptyFields });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid id" });
  }

  try {
    const user = await User.findOneAndUpdate(
      { _id: id },
      { name, email },
      { new: true }
    );

    if (!user) {
      return res.status(400).json({ error: "No user found" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { loginUser, signupUser, getUsers , updateUser};