const express = require("express");
const { loginUser, signupUser,getUsers } = require("../controllers/userController");

// router
const router = express.Router();

// login route
router.post("/login", loginUser);

// sign up route
router.post("/signup", signupUser);

// get users
router.get('/users',getUsers)

module.exports = router;
