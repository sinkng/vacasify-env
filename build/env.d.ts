export declare enum StageEnum {
    DEV = "dev",
    PROD = "prod"
}
export declare type EnvOptions = {
    /** Current working directory. Default process.cwd() */
    cwd?: string;
    /** Default ".env.example" */
    envFilename?: string;
    /** Default false */
    force?: boolean;
    /** Stage. Default "dev" */
    stage?: StageEnum;
};
/**
 * Init env
 *
 * @public
 * @async
 * @param opts - Options to initialize
 */
export declare function init(opts?: EnvOptions): Promise<void>;
/**
 * Retrieve env value
 *
 * @public
 * @param envName - Name of env to retrieve
 * @param defaultValue - Default value if not exists
 * @returns - Env value
 * @throws {Error} - Env has not yet initialized.
 */
export declare function env(envName: string, defaultValue: string): string;
