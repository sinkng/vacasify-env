import { Env } from '../types';
import { parse } from 'yaml';
import * as fs from 'fs';
import * as path from 'path';

export default function ymlToEnv(
  envFilename: string,
  cwd: string,
): Env[] {
  const envFile = path.resolve(cwd, envFilename);
  const envFileContent = fs.readFileSync(envFile, { encoding: 'utf-8'});

  const parsedEnvArr = parse(envFileContent);

  if (!Array.isArray(parsedEnvArr)) {
    throw new Error(`${envFilename} should contains array.`);
  }

  return parsedEnvArr.reduce((acc, item) => {
    let obj = undefined as unknown as Env;
    if (typeof item === 'string') {
      obj = { name: item };
    } else {
      obj = { name: item.name };
      const dangerously = item['dangerously-inject-into-process-env-as'];
      if (dangerously !== undefined) {
        obj.dangerouslyInjectIntoProcessEnvAs = dangerously;
      }
    }
    acc.push(obj);
    return acc;
  }, [] as Env[]);
}