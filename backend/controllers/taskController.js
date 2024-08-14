const mongoose = require("mongoose");
const Task = require("../models/taskModel");
const User = require("../models/userModel");

// Get all tasks
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single task
const getSingleTask = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid id" });
  }

  try {
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ error: "No task found!" });
    }

    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const postTask = async (req, res) => {
  const { title, description, project, assignedToEmail, status, dueDate } = req.body;

  let emptyFields = [];

  if (!title) emptyFields.push("title");
  if (!project) emptyFields.push("project");
  if (!assignedToEmail) emptyFields.push("assignedToEmail");

  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill in all the required fields!", emptyFields });
  }

  try {
    // Find the user by email
    const assignedUser = await User.findOne({ email: assignedToEmail });

    if (!assignedUser) {
      return res.status(404).json({ error: "Assigned user not found!" });
    }
    // email
    console.log(req.body)

    // Create the task
    const task = await Task.create({
      title,
      description,
      project,
      assignedTo: assignedUser._id,
      status,
      dueDate,
    });

    res.status(201).json(task);
  } catch (err) {
    console.log(err.message)
    res.status(400).json({ error: err.message });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid id" });
  }

  try {
    const task = await Task.findOneAndDelete({ _id: id });

    if (!task) {
      return res.status(400).json({ error: "No task found" });
    }

    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a task
const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, project, assignedTo, status, dueDate } = req.body;

  let emptyFields = [];

  if (!title) emptyFields.push("title");
  if (!project) emptyFields.push("project");

  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill in all the required fields!", emptyFields });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid id" });
  }

  try {
    const task = await Task.findOneAndUpdate(
      { _id: id },
      { title, description, project, assignedTo, status, dueDate },
      { new: true }
    );

    if (!task) {
      return res.status(400).json({ error: "No task found" });
    }

    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get tasks by project
const getTasksByProject = async (req, res) => {
  const { projectId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return res.status(404).json({ error: "Invalid project id" });
  }

  try {
    const tasks = await Task.find({ project: projectId });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get tasks by assigned user
const getTasksByAssignedUser = async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(404).json({ error: "Invalid user id" });
  }

  try {
    const tasks = await Task.find({ assignedTo: userId });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllTasks,
  getSingleTask,
  postTask,
  deleteTask,
  updateTask,
  getTasksByProject,
  getTasksByAssignedUser,
};