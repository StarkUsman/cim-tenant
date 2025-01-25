const { v4: uuidv4 } = require('uuid');
const TenantModel = require('../model/tenantSchema');

// Save a new tenant
exports.save = async (req, res) => {
    try {
        const { tenantName, tenantSettings, status } = req.body;

        // Validate required fields
        if (!tenantName || !tenantSettings || !status) {
            return res.status(400).send({
                message: "Validation failed: 'tenantName', 'tenantSettings', and 'status' are required."
            });
        }

        // Validate `tenantSettings` structure
        const requiredSettings = [
            "realm", "auth-server-url", "ef-server-url", "ssl-required", "resource",
            "verify-token-audience", "credentials", "use-resource-role-mappings",
            "confidential-port", "policy-enforcer", "CLIENT_ID", "CLIENT_DB_ID",
            "GRANT_TYPE", "GRANT_TYPE_PAT", "USERNAME_ADMIN", "PASSWORD_ADMIN",
            "SCOPE_NAME", "bearer-only", "FINESSE_URL", "TWILIO_SID",
            "TWILIO_VERIFY_SID", "TWILIO_AUTH_TOKEN"
        ];

        const missingSettings = requiredSettings.filter(key => !Object.keys(tenantSettings).includes(key));
        if (missingSettings.length > 0) {
            return res.status(400).send({
                message: `Validation failed: Missing tenantSettings fields: ${missingSettings.join(', ')}`
            });
        }

        // Create a Tenant
        const tenant = new TenantModel({
            tenantId: uuidv4(),
            tenantName,
            tenantSettings,
            status,
        });

        // Save Tenant in the database
        const data = await tenant.save();
        console.log("Created tenant:", data.tenantId);
        res.status(201).send(data);
    } catch (error) {
        console.error("Error creating tenant:", error);
        res.status(500).send({
            message: error.message || "An error occurred while creating the tenant."
        });
    }
};

// Retrieve all tenants
exports.getTenants = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const sort = req.query.sort || 'createdAt:desc';

    try {
        const [sortAttribute, sortOrder] = sort.split(':');
        const sortObj = { [sortAttribute]: sortOrder === 'desc' ? -1 : 1 };

        const tenants = await TenantModel.find().sort(sortObj).skip(offset).limit(limit);
        console.log("Found tenants:", tenants.length);
        res.send(tenants);
    } catch (error) {
        console.error("Error retrieving tenants:", error);
        res.status(500).send({
            message: error.message || "An error occurred while retrieving tenants."
        });
    }
};

// Retrieve a tenant by ID
exports.getById = async (req, res) => {
    const id = req.params.id;

    if (!id) {
        return res.status(400).send({ message: "Tenant ID is required." });
    }

    try {
        const tenant = await TenantModel.findById(id);
        if (!tenant) {
            return res.status(404).send({ message: `Tenant not found with ID ${id}` });
        }
        console.log("Found tenant:", tenant.tenantId);
        res.send(tenant);
    } catch (error) {
        console.error("Error retrieving tenant:", error);
        res.status(500).send({ message: `Error retrieving tenant with ID ${id}` });
    }
};

// Update a tenant by ID
exports.updateById = async (req, res) => {
    const id = req.params.id;

    if (!id) {
        return res.status(400).send({ message: "Tenant ID is required." });
    }

    try {
        const updatedTenant = await TenantModel.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedTenant) {
            return res.status(404).send({ message: `Tenant not found with ID ${id}` });
        }
        console.log("Updated tenant:", updatedTenant.tenantId);
        res.send(updatedTenant);
    } catch (error) {
        console.error("Error updating tenant:", error);
        res.status(500).send({ message: `Error updating tenant with ID ${id}` });
    }
};

// Delete a tenant by ID
exports.deleteById = async (req, res) => {
    const id = req.params.id;

    if (!id) {
        return res.status(400).send({ message: "Tenant ID is required." });
    }

    try {
        const deletedTenant = await TenantModel.findByIdAndDelete(id);
        if (!deletedTenant) {
            return res.status(404).send({ message: `Tenant not found with ID ${id}` });
        }
        console.log("Deleted tenant:", deletedTenant.tenantId);
        res.send({ message: "Tenant deleted successfully." });
    } catch (error) {
        console.error("Error deleting tenant:", error);
        res.status(500).send({ message: `Could not delete tenant with ID ${id}` });
    }
};

// Delete all tenants (admin access)
exports.deleteAll = async (req, res) => {
    const adminToken = req.params.adminToken;

    if (!adminToken) {
        return res.status(400).send({ message: "Admin token is required to delete all tenants." });
    }

    if (adminToken !== "abc123") {
        return res.status(401).send({ message: "Unauthorized to delete all tenants." });
    }

    try {
        const result = await TenantModel.deleteMany({});
        console.log("Deleted tenants:", result.deletedCount);
        res.send({ message: "All tenants deleted successfully." });
    } catch (error) {
        console.error("Error deleting all tenants:", error);
        res.status(500).send({ message: "Could not delete tenants." });
    }
};
