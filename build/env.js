"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = exports.load = exports.init = void 0;
const client_ssm_1 = require("@aws-sdk/client-ssm");
const yml_to_env_1 = require("./utils/yml-to-env");
let ENV = {};
let isLoaded = false;
async function loadEnvValues(keys, stage) {
    /** Resolve bugs that only 10 parameters can be fetch in a batch */
    if (keys.length > 10) {
        let promises = [];
        const items = [...keys];
        while (true) {
            const pageItems = items.splice(0, 10);
            if (pageItems.length === 0)
                break;
            promises = [
                ...promises,
                loadEnvValues(pageItems, stage),
            ];
        }
        const results = await Promise.all(promises);
        return (results || []).reduce((acc, item) => {
            acc = { ...acc, ...item };
            return acc;
        }, {});
    }
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
    return (results || []).reduce((acc, item) => {
        const { Name: name, Value: value } = item;
        const k = name === null || name === void 0 ? void 0 : name.replace(`/${stage}/`, '');
        acc[k] = value;
        return acc;
    }, {});
}
/**
 * Set env
 *
 * @public
 * @async
 * @param opts - Options to initialize
 */
function init(keyValuePairs) {
    isLoaded = true;
    ENV = { ...keyValuePairs };
}
exports.init = init;
/**
 * Init env
 *
 * @public
 * @async
 * @param opts - Options to initialize
 */
async function load(opts) {
    // Parse env file the key
    let doReload = opts.force || false;
    if (!doReload)
        doReload = isLoaded === false;
    if (!doReload)
        return;
    // Get keys
    const envFilename = opts.envFilename || '.env.yml';
    const cwd = (opts === null || opts === void 0 ? void 0 : opts.cwd) || process.cwd();
    const envArray = (0, yml_to_env_1.default)(envFilename, cwd);
    // Fetch env values
    const keys = envArray.map(item => item.name);
    const env = await loadEnvValues(keys, opts.stage);
    // Set
    isLoaded = true;
    ENV = { ...env };
    // Dangerously injecting into process.env only-if specified
    envArray.forEach(item => {
        const { name, alias, dangerouslyInjectIntoProcessEnvAs: dangerously, } = item;
        if (dangerously !== undefined) {
            process.env[dangerously] = env[name];
        }
        if (alias !== undefined) {
            ENV[alias] = env[name];
        }
    });
}
exports.load = load;
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
        console.warn('Env is not yet loaded. Please await init() to load env before continue.');
    }
    return ENV[envName] === undefined /* Resolve 0 is consider falsy */
        ? defaultValue
        : ENV[envName];
}
exports.env = env;
env.int = function (envName, defaultValue) {
    const value = env(envName, undefined);
    if (!value) {
        return defaultValue;
    }
    const retVal = Number(value);
    if (isNaN(retVal)) {
        return defaultValue;
    }
    return Number(value);
};
env.bool = function (envName, defaultValue) {
    var _a, _b;
    const value = env(envName, undefined);
    console.log(envName, value, ENV);
    if (value === undefined) {
        return defaultValue;
    }
    // Resolving Boolean("false") yields true
    const t = (_b = (_a = value === null || value === void 0 ? void 0 : value.toString()) === null || _a === void 0 ? void 0 : _a.trim()) === null || _b === void 0 ? void 0 : _b.toLowerCase();
    if (t === 'false' || t === '0') {
        return false;
    }
    return Boolean(value);
};
