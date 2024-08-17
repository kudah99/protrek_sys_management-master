const express = require("express");
const { loginUser, signupUser,getUsers, updateUser } = require("../controllers/userController");

// router
const router = express.Router();

// login route
router.post("/login", loginUser);

// sign up route
router.post("/signup", signupUser);

// update route
router.put("/edit/:id", updateUser);



// get users
router.get('/all',getUsers)

module.exports = router;
