const mongoose = require("mongoose");
const config = require("./config/config.js");
const logger = require("./config/logger.js");
const app = require("./app"); // Import app.js

// Database Connection
mongoose.Promise = global.Promise;
mongoose
  .connect(config.mongoose.url, config.mongoose.options)
  .then(() => {
    // console.log("Database Connected Successfully!!");
    logger.info(`Connected to MongoDB on ${mongoose.connection.host}`, {
        className: "index.js",
        methodName: "mongoose.connect"
      });
  })
  .catch((err) => {
    console.error("Could not connect to the database", err);
    process.exit(1);
  });

// Server Listener
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
