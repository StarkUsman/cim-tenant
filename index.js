const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const config = require('./config/config.js');
const TenantRoutes = require('./routes/tenantRoutes.js');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Root Route
app.get('/', (req, res) => {
    res.json({ message: "Hello Crud Node Express" });
});

// Database Connection
mongoose.Promise = global.Promise;
mongoose.connect(config.mongoose.url, config.mongoose.options)
    .then(() => {
        console.log("Database Connected Successfully!!");
    })
    .catch(err => {
        console.error('Could not connect to the database', err);
        process.exit(1); 
    });

// Routes
app.use('/tenant', TenantRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error("An error occurred:", err.message);
    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error",
    });
});

// Server Listener
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
