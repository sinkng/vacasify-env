# vacasify-env

Resolving loading env in a secure way. Prevent other packages to steal our ```process.env``` variables.

## Requirements

This package requires these env variables for fetch from AWS Paramter Store. Please restrict this key to only certain resources using AWS IAM console.

```process.env.AWS_REGION```
```process.env.AWS_SMS_KEY```
```process.env.AWS_SMS_SEC```

## Load env
Any backend service is using this module - SHOULD always load the env first before start their application.


## Public Methods

```

async load(opts?: EnvOptions): Promise<void>;

init(keyValuePairs: Record<string, any>): void;

env(envName: string, defaultValue?: string): string | undefined;

env.int(envName: string, defaultValue?: number): number | undefined;

env.bool(envName: string, defaultValue?: boolean): boolean | undefined;

```

