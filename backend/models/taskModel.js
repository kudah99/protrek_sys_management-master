const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const taskSchema =new Schema(
    {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Project',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['pending', 'in progress', 'completed'],
      default: 'pending',
    },
    dueDate: {
      type: Date,
    },
  }, {
    timestamps: true,
  });

  module.exports =  mongoose.model('Task', taskSchema);