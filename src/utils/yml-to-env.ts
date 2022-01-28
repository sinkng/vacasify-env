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
  }, [] as Env[]);
}