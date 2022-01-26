import { SSMClient, GetParametersCommand } from "@aws-sdk/client-ssm";
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

export enum StageEnum {
  DEV = 'dev',
  PROD = 'prod',
}

export type EnvOptions = {
  /** Current working directory. Default process.cwd() */
  cwd?: string;
  /** Default ".env.example" */
  envFilename?: string;
  /** Default false */
  force?: boolean;
  /** Stage. Default "dev" */
  stage?: StageEnum,
}

let ENV = {};
let isLoaded = false;

function loadEnvKeys(
  envFilename: string,
  cwd: string,
): string[] {
  const envFile = path.resolve(cwd, envFilename);
  const buf = Buffer.from(fs.readFileSync(envFile, { encoding: 'utf-8'}));
  const config = dotenv.parse(buf) || {};
  return Object.keys(config);
}

async function loadEnvValues(
  keys: string[],
  stage: StageEnum,
): Promise<
  Record<string, any>
> {
  /** Resolve bugs that only 10 parameters can be fetch in a batch */
  if (keys.length > 10) {
    let promises: any = [];
    const items = [...keys];
    while (true) {
      const pageItems = items.splice(0, 10);
      if (pageItems.length === 0) break;
      promises = [
        ...promises,
        loadEnvValues(pageItems, stage),
      ];
    }
    const results = await Promise.all(promises);
    return (results || []).reduce((acc, item) => {
      acc = { ...acc, ...item };
      return acc;
    }, {} as Record<string, any>);
  }

  const cmd = new GetParametersCommand({
    Names: keys.map(item => `/${stage}/${item}`),
    WithDecryption: true,
  });

  const client = new SSMClient({
    region: process.env.AWS_REGION as string,
    credentials: {
      accessKeyId: process.env.AWS_SSM_KEY as string,
      secretAccessKey: process.env.AWS_SSM_SEC as string,
    },
  });

  const { Parameters: results } = await client.send(cmd);

  return (results || []).reduce((acc, item) => {
    const { Name: name, Value: value } = item;
    const k = name?.replace(`/${stage}/`, '') as string;
    acc[k] = value;
    return acc;
  }, {} as Record<string, any>);
}

/**
 * Set env
 *
 * @public
 * @async
 * @param opts - Options to initialize
 */
export function init(
  keyValuePairs: Record<string, any>,
): void {
  isLoaded = true;
  ENV = {...keyValuePairs};
}

/**
 * Init env
 *
 * @public
 * @async
 * @param opts - Options to initialize
 */
export async function load(
  opts?: EnvOptions,
): Promise<
  void
> {
  // Parse env file the key
  let doReload = opts?.force || false;
  if (!doReload) doReload = isLoaded === false;
  if (!doReload) return;

  // Get keys
  const envFilename = opts?.envFilename || '.env.example';
  const cwd = opts?.cwd || process.cwd();
  const envKeys = loadEnvKeys(envFilename, cwd);

  // Load env values
  const env = await loadEnvValues(
    envKeys,
    opts?.stage || StageEnum.DEV,
  );

  // Set
  isLoaded = true;
  ENV = {...env}
}

/**
 * Retrieve env value
 *
 * @public
 * @param envName - Name of env to retrieve
 * @param defaultValue - Default value if not exists
 * @returns - Env value
 * @throws {Error} - Env has not yet initialized.
 */
export function env(
  envName: string,
  defaultValue?: string,
): string {
  if (!isLoaded) {
    console.warn('Env is not yet loaded. Please await init() to load env before continue.');
  }
  return ENV[envName] === undefined /* Resolve 0 is consider falsy */
    ? defaultValue
    : ENV[envName];
}

env.int = function(
  envName: string,
  defaultValue?: number,
): number | undefined {
  const value = env(envName, undefined);

  if (!value) {
    return defaultValue;
  }

  const retVal = Number(value);
  if (isNaN(retVal)) {
    return defaultValue;
  }

  return Number(value);
}

env.bool = function(
  envName: string,
  defaultValue?: boolean,
): boolean | undefined {
  const value = env(envName, undefined);

  console.log(envName, value, ENV);


  if (value === undefined) {
    return defaultValue;
  }

  // Resolving Boolean("false") yields true
  const t = value?.toString()?.trim()?.toLowerCase();
  if (t === 'false' || t === '0') {
    return false;
  }

  return Boolean(value);
}
