const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
cors = require('cors');

const config = require('./config/config.js');
const UserRoute = require('./routes/tenantRoutes.js');


const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.get('/', (req, res) => {
    res.json({"message": "Hello Crud Node Express"});
});
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});

mongoose.Promise = global.Promise;
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
    console.log("Databse Connected Successfully!!");    
}).catch(err => {
    console.log('Could not connect to the database', err);
    process.exit();
});

app.use('/tenant',UserRoute)