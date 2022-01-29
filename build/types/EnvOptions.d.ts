import { StageEnum } from '../enums';
import { Credentials } from '../types';
export declare type EnvOptions = {
    /** Current working directory. Default process.cwd() */
    cwd?: string;
    /** Default ".env.example" */
    envFilename?: string;
    /** Default false */
    force?: boolean;
    /** Indicating what stage to fetch env */
    stage: StageEnum | string;
    /** Credentials to retrieve env */
    credentials: Credentials;
};
