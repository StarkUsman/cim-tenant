var mongoose = require('mongoose');
var tenantSchema = new mongoose.Schema({
    tenantId: {
        type: String,
        unique: true,
        required: true,
    },
    tenantName: {
        type: String,
        required: true,
    },
    tenantSettings: {
        type: Object,
        required: true,
    },
    status:{
        type: String,
        required: true,
        enum: ["active", "inActive"]
    }},
    {
        strict: false,
        timestamps: true
    }
);
var tenant = new mongoose.model('Tenant', tenantSchema);
module.exports = tenant;