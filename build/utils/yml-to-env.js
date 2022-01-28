"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yaml_1 = require("yaml");
const fs = require("fs");
const path = require("path");
function ymlToEnv(envFilename, cwd) {
    const envFile = path.resolve(cwd, envFilename);
    const envFileContent = fs.readFileSync(envFile, { encoding: 'utf-8' });
    const parsedEnvArr = (0, yaml_1.parse)(envFileContent);
    if (!Array.isArray(parsedEnvArr)) {
        throw new Error(`${envFilename} should contains array.`);
    }
    return parsedEnvArr.reduce((acc, item) => {
        if (typeof item === 'string') {
            acc.push({ name: item });
            return acc;
        }
        const { name, alias } = item;
        const dangerously = item['dangerously-inject-into-process-env-as'];
        acc.push({
            name,
            alias,
            dangerouslyInjectIntoProcessEnvAs: dangerously,
        });
        return acc;
    }, []);
}
exports.default = ymlToEnv;
