const { v4: uuidv4 } = require('uuid');
const TenantModel = require('../model/tenantSchema');

exports.save = async (req, res) => {
    try {
        // Validate request
        if (!req.body.tenantName || !req.body.tenantSettings || !req.body.status) {
            return res.status(400).send({
                message: "Object validation failed, please check the request body"
            });
        }

        // Create a Tenant
        const tenant = new TenantModel({
            tenantId: uuidv4(),
            tenantName: req.body.tenantName,
            tenantSettings: req.body.tenantSettings,
            status: req.body.status
        });

        // Save Tenant in the database
        const data = await tenant.save();
        console.log("Created tenant:", data.tenantId);
        res.status(201).send(data);
    } catch (error) {
        console.error("Error creating tenant:", error);
        res.status(500).send({
            message: error.message || "Some error occurred while creating the Tenant."
        });
    }
};
// Retrieve all tenants from the database.
exports.getTenants = async (req, res) => {
    const limit = req.params.limit ? parseInt(req.params.limit) : 10;
    const offset = req.params.offset ? parseInt(req.params.offset) : 0;
    const sort = req.query.sort || 'createdAt:desc';
    
    const sortObj = {};
    try{
        const [sortAttribute, sortValue] = sort.split(':');
        sortObj[sortAttribute] = sortValue === 'desc' ? -1 : 1;
    } catch (error){
        console.error("Error parsing sort query parameter:", error);
        return res.status(400).send({
            message: "Invalid sort query parameter"
        });
    }
    try {
        const tenants = await TenantModel.find().sort(sortObj).skip(offset).limit(limit);
        console.log("Found tenants:", tenants.length);
        res.send(tenants);
    } catch (error) {
        console.error("Error retrieving tenants:", error);
        res.status(500).send({
            message: error.message || "Some error occurred while retrieving tenants."
        });
    }
};

exports.getById = async (req, res) => {
    if (!req.params.id) {
        return res.status(400).send({
            message: "Tenant id is required"
        });
    }
    const id = req.params.id;
    try {
        const tenant = await TenantModel.findById(id);
        if (!tenant) {
            return res.status(404).send({
                message: "Tenant not found with id " + id
            });
        }
        console.log("Found tenant:", tenant.tenantId);
        res.send(tenant);
    } catch (error) {
        console.error("Error retrieving tenant:", error);
        if (error.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Tenant not found with id " + id
            });
        }
        return res.status(500).send({
            message: "Error retrieving tenant with id " + id
        });
    }
};

exports.updateById = async (req, res) => {
    if (!req.params.id) {
        return res.status(400).send({
            message: "Tenant id is required"
        });
    }
    const id = req.params.id;
    if (!req.body) {
        return res.status(400).send({
            message: "Request Body can not be empty"
        });
    }
    try {
        const tenant = await TenantModel.findByIdAndUpdate(id, req.body, {new: true});
        if (!tenant) {
            return res.status(404).send({
                message: "Tenant not found with id " + id
            });
        }
        console.log("Updated tenant:", tenant.tenantId);
        res.send(tenant);
    } catch (error) {
        console.error("Error updating tenant:", error);
        if (error.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Tenant not found with id " + id
            });
        }
        return res.status(500).send({
            message: "Error updating tenant with id " + id
        });
    }
};

exports.deleteById = async (req, res) => {
    if (!req.params.id) {
        return res.status(400).send({
            message: "Tenant id is required"
        });
    }
    const id = req.params.id;
    try {
        const tenant = await TenantModel.findOneAndDelete(id);
        if (!tenant) {
            return res.status(404).send({
                message: "Tenant not found with id " + id
            });
        }
        console.log("Deleted tenant:", tenant.tenantId);
        res.send({message: "Tenant deleted successfully!"});
    } catch (error) {
        console.error("Error deleting tenant:", error);
        if (error.kind === 'ObjectId' || error.name === 'NotFound') {
            return res.status(404).send({
                message: "Tenant not found with id " + id
            });
        }
        return res.status(500).send({
            message: "Could not delete tenant with id " + id
        });
    }
};

exports.deleteAll = async (req, res) => {
    if (!req.params.adminToken) {
        return res.status(400).send({
            message: "Admin token is required to delete all tenants"
        });
    }
    const adminToken = req.params.adminToken;
    if (adminToken !== "abc123") {
        return res.status(401).send({
            message: "Unauthorized to delete all tenants"
        });
    }
    try {
        const tenants = await TenantModel.deleteMany({});
        console.log("Deleted tenants:", tenants.deletedCount);
        res.send({message: "All Tenants deleted successfully!"});
    } catch (error) {
        console.error("Error deleting tenants:", error);
        return res.status(500).send({
            message: "Could not delete tenants"
        });
    }
};