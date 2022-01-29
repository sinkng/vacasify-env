# vacasify-env

Resolving loading env in a secure way. Prevent other packages to steal our ```process.env``` variables.

## Credentials

A pair of key and secret to fetch from AWS Paramter Store.

Please RESTRICT this key to only certain resources using AWS IAM console.


## Load env
Any backend service is using this module - SHOULD always load the env first before start their application.


## Methods & Types

```
type Credentials = {
  awsRegion: string;
  awsKey: string;
  awsSecret: string;
}

type EnvOptions = {
  /** Current working directory. Default process.cwd() */
  cwd?: string;

  /** Default ".env.yml" */
  envFilename?: string;

  /** Whether to force loading (even if already loaded). Default false */
  force?: boolean;

  /** Indicating what stage to fetch env */
  stage: "dev" | "prod" | string,

  /** Credentials to fetch from aws. Note this credentials should be controlled in IAM to only allow certain access */
  credentials: Credentials;
}

async load(opts: EnvOptions): Promise<void>;

init(keyValuePairs: Record<string, any>): void;

env(envName: string, defaultValue?: string): string | undefined;

env.int(envName: string, defaultValue?: number): number | undefined;

env.bool(envName: string, defaultValue?: boolean): boolean | undefined;

```

## Example

```

import { load as loadEnv, env } from '@sinkng/vacasify-env';

(async () => {
  // Load ENV
  await loadEnv();

  console.log(env('backoffice___DB_NAME'));

  console.log(process.env);
})();

```


```

const { load: loadEnv, env } = require('@sinkng/vacasify-env');

(async () => {
  // Load ENV
  await loadEnv();

  console.log(env('backoffice___DB_NAME'));

  console.log(process.env);
})();

```


## ".env.yml" template

```

- backoffice___DB_CLIENT # add your comment here
- backoffice___DB_NAME
- backoffice___DB_HOST
- backoffice___DB_PORT
- backoffice___DB_USERNAME
- backoffice___DB_PASSWORD

# OR

- name: backoffice___JWT_SECRET

# OR

- name: backoffice___API_TOKEN_SALT
  dangerously-inject-into-process-env-as: API_TOKEN_SALT # USE WITH CAUTION because this
  # will inject into process.env as "process.env.API_TOKEN_SALT" and which allow hacker to steal our env

```

## AWS Parameter Store

Should create new parameter store with this format ```/{stage}/{productName}___{varName}``` e.g. ```/dev/backoffice___DB_PASSWORD```