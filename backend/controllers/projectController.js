const mongoose = require("mongoose");
const Project = require("../models/projectModel");

// Get all projects
const getAllProjects = async (req, res) => {
  const owner = req.user._id;

  try {
    const projects = await Project.find({ owner: owner }).sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single project
const getSingleProject = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid id" });
  }

  try {
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ error: "No project found!" });
    }

    res.status(200).json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Post a new project
const postProject = async (req, res) => {
  const { name, description } = req.body;

  let emptyFields = [];

  if (!name) emptyFields.push("name");

  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill in all the fields!", emptyFields });
  }

  try {
    const owner = req.user._id;
    console.log(owner);
    const project = await Project.create({
      name,
      description,
      owner,
    });

    res.status(200).json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a project
const deleteProject = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid id" });
  }

  try {
    const project = await Project.findOneAndDelete({ _id: id });

    if (!project) {
      return res.status(400).json({ error: "No project found" });
    }

    res.status(200).json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a project
const updateProject = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

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
    const project = await Project.findOneAndUpdate(
      { _id: id },
      { name, description },
      { new: true }
    );

    if (!project) {
      return res.status(400).json({ error: "No project found" });
    }

    res.status(200).json(project);
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  postProject,
  getAllProjects,
  getSingleProject,
  deleteProject,
  updateProject,
};