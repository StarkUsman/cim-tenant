const dotenv = require("dotenv");
const path = require("path");
const Joi = require("@hapi/joi");

dotenv.config({ path: path.join(__dirname, "../cim-tenant.env") });

const envVarsSchema = Joi.object().keys({
    MONGODB_HOST: Joi.string().required().description("Mongo DB url"),
    MONGODB_USERNAME: Joi.string().required().description("Mongo DB username"),
    MONGODB_PASSWORD: Joi.string().required().description("Mongo DB password"),
    HTTP_PORT: Joi.number().required().default(3000),
    LOG_LEVEL: Joi.string().valid("error", "warn", "info", "http", "verbose", "debug", "silly").required(),
}).unknown(true);

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: "key" } }).validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

mongoose = {
    url: `mongodb://${envVars.MONGODB_USERNAME}:${envVars.MONGODB_PASSWORD}@${envVars.MONGODB_HOST}`,
    options: {
        dbName: 'cim-tenant',    }
}

module.exports = {
    mongoose,
    MONGODB_HOST: envVars.MONGODB_HOST,
    MONGODB_USERNAME: envVars.MONGODB_USERNAME,
    MONGODB_PASSWORD: envVars.MONGODB_PASSWORD,
    PORT: envVars.HTTP_PORT,
    logLevel: envVars.LOG_LEVEL
}