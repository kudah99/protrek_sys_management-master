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

// get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password"); // Exclude password field for security
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// update user details
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  try {
    if (!name && !email && !password) {
      throw Error("No updates provided.");
    }

    const updates = {};

    if (name) {
      updates.name = name;
    }

    if (email) {
      if (!validator.isEmail(email)) {
        throw Error("Invalid Email");
      }

      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== id) {
        throw Error("Email already in use by another account.");
      }
      updates.email = email;
    }

    if (password) {
      if (!validator.isStrongPassword(password)) {
        throw Error(
          "Your password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one symbol. Please try again with a stronger password."
        );
      }

      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password, salt);
    }

    const user = await User.findByIdAndUpdate(id, updates, { new: true }).select("-password");
    
    if (!user) {
      throw Error("User not found.");
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { loginUser, signupUser, getUsers, updateUser };