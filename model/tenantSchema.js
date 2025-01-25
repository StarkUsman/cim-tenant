var mongoose = require('mongoose');

// Define a schema for tenantSettings
var tenantSettingsSchema = new mongoose.Schema(
    {
        realm: {
            type: String,
            required: true
        },
        "auth-server-url": {
            type: String,
            required: true
        },
        "ef-server-url": {
            type: String,
            required: true
        },
        "ssl-required": {
            type: String, 
            required: true 
        },
        resource: { 
            type: String, 
            required: true 
        },
        "verify-token-audience": { 
            type: Boolean, 
            required: true 
        },
        credentials: {
            secret: { 
                type: String, 
                required: true 
            },
        },
        "use-resource-role-mappings": { 
            type: Boolean, 
            required: true 
        },
        "confidential-port": { 
            type: Number, 
            required: true 
        },
        "policy-enforcer": { 
            type: Object, 
            default: {} 
        },
        CLIENT_ID: { 
            type: String, 
            required: true 
        },
        CLIENT_DB_ID: { 
            type: String, 
            required: true 
        },
        GRANT_TYPE: { 
            type: String, 
            required: true 
        },
        GRANT_TYPE_PAT: { 
            type: String, 
            required: true 
        },
        USERNAME_ADMIN: { 
            type: String, 
            required: true 
        },
        PASSWORD_ADMIN: { 
            type: String, 
            required: true 
        },
        SCOPE_NAME: { 
            type: String, 
            required: true 
        },
        "bearer-only": { 
            type: Boolean, 
            required: true 
        },
        FINESSE_URL: { 
            type: String, 
            required: true 
        },
        TWILIO_SID: { 
            type: String, 
            required: true 
        },
        TWILIO_VERIFY_SID: { 
            type: String, 
            required: true 
        },
        TWILIO_AUTH_TOKEN: { 
            type: String, 
            required: true 
        },
});

// Define the main tenant schema
var tenantSchema = new mongoose.Schema(
    {
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
            type: tenantSettingsSchema,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: ["active", "inActive"],
        },
    },
    {
        strict: false,
        timestamps: true,
    }
);

var Tenant = mongoose.model('Tenant', tenantSchema);
module.exports = Tenant;
