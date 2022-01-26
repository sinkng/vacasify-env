"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = exports.init = exports.StageEnum = void 0;
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const client_ssm_1 = require("@aws-sdk/client-ssm");
var StageEnum;
(function (StageEnum) {
    StageEnum["DEV"] = "dev";
    StageEnum["PROD"] = "prod";
})(StageEnum = exports.StageEnum || (exports.StageEnum = {}));
let ENV = {};
let isLoaded = false;
function loadEnvKeys(envFilename, cwd) {
    const envFile = path.resolve(cwd, envFilename);
    const buf = Buffer.from(fs.readFileSync(envFile, { encoding: 'utf-8' }));
    const config = dotenv.parse(buf) || {};
    return Object.keys(config);
}
async function loadEnvValues(keys, stage) {
    const cmd = new client_ssm_1.GetParametersCommand({
        Names: keys.map(item => `/${stage}/${item}`),
        WithDecryption: true,
    });
    const client = new client_ssm_1.SSMClient({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_SSM_KEY,
            secretAccessKey: process.env.AWS_SSM_SEC,
        },
    });
    const { Parameters: results } = await client.send(cmd);
    return results === null || results === void 0 ? void 0 : results.reduce((acc, item) => {
        const { Name: name, Value: value } = item;
        const k = name === null || name === void 0 ? void 0 : name.replace(`/${stage}/`, '');
        acc[k] = value;
        return acc;
    }, {});
}
/**
 * Init env
 *
 * @public
 * @async
 * @param opts - Options to initialize
 */
async function init(opts) {
    // Parse env file the key
    let doReload = (opts === null || opts === void 0 ? void 0 : opts.force) || false;
    if (!doReload)
        doReload = isLoaded === false;
    if (!doReload)
        return;
    // Get keys
    const envFilename = (opts === null || opts === void 0 ? void 0 : opts.envFilename) || '.env.example';
    const cwd = (opts === null || opts === void 0 ? void 0 : opts.cwd) || process.cwd();
    const envKeys = loadEnvKeys(envFilename, cwd);
    // Load env values
    const env = await loadEnvValues(envKeys, (opts === null || opts === void 0 ? void 0 : opts.stage) || StageEnum.DEV);
    // Set
    isLoaded = true;
    ENV = { ...env };
}
exports.init = init;
/**
 * Retrieve env value
 *
 * @public
 * @param envName - Name of env to retrieve
 * @param defaultValue - Default value if not exists
 * @returns - Env value
 * @throws {Error} - Env has not yet initialized.
 */
function env(envName, defaultValue) {
    if (!isLoaded) {
        throw new Error('Env is not yet loaded. Please await init() to load env before continue.');
    }
    return ENV[envName] || defaultValue;
}
exports.env = env;
