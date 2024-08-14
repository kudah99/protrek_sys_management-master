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