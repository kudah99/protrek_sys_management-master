const express = require("express");
const {
  getAllTasks,
  getSingleTask,
  postTask,
  deleteTask,
  updateTask,
  getTasksByProject,
  getTasksByAssignedUser,
} = require("../controllers/taskController");

const router = express.Router();
const requireAuth = require("../middlewares/requireAuth");
router.use(requireAuth); // if the authentication is okay, then the next commands will execute

// Get all tasks
router.get("/", getAllTasks);

// Get a single task
router.get("/:id", getSingleTask);

// Post a new task
router.post("/", postTask);

// Delete a task
router.delete("/:id", deleteTask);

// Update a task
router.patch("/:id", updateTask);

// Get tasks by project
router.get("/project/:projectId", getTasksByProject);

// Get tasks by assigned user
router.get("/assigned/:userId", getTasksByAssignedUser);

module.exports = router;