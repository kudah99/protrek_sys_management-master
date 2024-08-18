require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const projectsRoutes = require("./routes/projectRoute");
const userRoutes = require("./routes/userRoute");
const taskRoutes = require("./routes/taskRoutes")
const statsRoutes = require("./routes/stats")
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const nodeCron = require("node-cron");
const nodemailer = require("nodemailer");
const Task = require("./models/taskModel")

// express app
const app = express();

// port
const port = process.env.PORT || 3000;
const swaggerDocument = YAML.load("./swagger.yaml");

// middlewares
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});


// Swagger route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// routes
app.use("/api/projects", projectsRoutes);
app.use("/api/user", userRoutes);
app.use("/api/tasks",taskRoutes);
app.use("/api/stats",statsRoutes)

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  host:'smtp.gmail.com',
  port: 465,
  secure:process.env.SSL,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  },
});

// Function to send an email
const sendEmail = (task) => {
  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: "blessedlionel20@gmail.com",
    subject: `Task Deadline Reminder: ${task.title}`,
    text: `The task "${task.title}" is due today. Please make sure to complete it.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Email sent: " + info.response);
  });
};

// Cron job runs every 10 minutes
nodeCron.schedule("*/10 * * * *", async () => {
  try {
    print("Checking deadlines started....")
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const endOfDay = new Date(now.setHours(23, 59, 59, 999));

    const tasks = await Task.find({
      dueDate: { $gte: startOfDay, $lte: endOfDay },
    });

    tasks.forEach((task) => {
      sendEmail(task);
    });
  } catch (err) {
    console.error("Error fetching tasks or sending emails: ", err);
  }
});

// connecting to the database(mongodb)
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // listening request
    app.listen(port, () => {
      console.log(`Connected to Mongo & Listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });