# vacasify-env

Resolving loading env in a secure way. Prevent other packages to steal our ```process.env``` variables.

## Requirements

This package requires these env variables for fetch from AWS Paramter Store. Please restrict this key to only certain resources using AWS IAM console.

```process.env.AWS_REGION```
```process.env.AWS_SSM_KEY```
```process.env.AWS_SSM_SEC```

## Load env
Any backend service is using this module - SHOULD always load the env first before start their application.


## Public Methods

```
type EnvOptions = {
  /** Current working directory. Default process.cwd() */
  cwd?: string;

  /** Default ".env.yml" */
  envFilename?: string;

  /** Whether to force loading (even if already loaded). Default false */
  force?: boolean;

  /** Stage. Default "dev" */
  stage?: StageEnum,
}

async load(opts?: EnvOptions): Promise<void>;

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
})();

```


```

const { load: loadEnv, env } = require('@sinkng/vacasify-env');

(async () => {
  // Load ENV
  await loadEnv();

  console.log(env('backoffice___DB_NAME'));
})();

```


## .env.yml template

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