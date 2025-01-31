const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const logger = require("./config/logger.js");
const TenantRoutes = require("./routes/tenantRoutes.js");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Morgan Logging - Custom Tokens
morgan.token("ip", (req) => req.ip || "N/A");
morgan.token("user-agent", (req) => req.headers["user-agent"] || "N/A");

// Define Custom Morgan Logging Format
const morganFormat =
  ":method | :url | :status | :response-time ms | IP: :ip | User-Agent: :user-agent";

// Use Morgan with Winston
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const statusCode = message.match(/\d{3}/) ? parseInt(message.match(/\d{3}/)[0]) : 200;
        const logLevel = statusCode >= 500 ? "error" : statusCode >= 400 ? "warn" : "info";

        logger[logLevel](message.trim());
      },
    },
  })
);

// Root Route
app.get("/", (req, res) => {
  res.json({ message: "Hello Node Express" });
});

// Tenant Routes
app.use("/tenant", TenantRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
