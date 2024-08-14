const express = require("express");
const router = express.Router();
const Task = require("../models/taskModel");
const Project = require("../models/projectModel");

router.get("/", async (req, res) => {
  try {
    const allTasks = await Task.countDocuments();
    const allProjects = await Project.countDocuments();
    const completedTasks = await Task.countDocuments({ status: "completed" });
    const pendingTasks = await Task.countDocuments({ status: "pending" });

    res.status(200).json({
      allTasks,
      allProjects,
      completedTasks,
      pendingTasks,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
