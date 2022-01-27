import { StageEnum } from '../enums';

export type EnvOptions = {
  /** Current working directory. Default process.cwd() */
  cwd?: string;

  /** Default ".env.example" */
  envFilename?: string;

  /** Default false */
  force?: boolean;

  /** Indicating what stage to fetch env */
  stage: StageEnum | string,
}