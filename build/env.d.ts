import { EnvOptions } from './types';
/**
 * Set env
 *
 * @public
 * @async
 * @param opts - Options to initialize
 */
export declare function init(keyValuePairs: Record<string, any>): void;
/**
 * Init env
 *
 * @public
 * @async
 * @param opts - Options to initialize
 */
export declare function load(opts: EnvOptions): Promise<void>;
/**
 * Retrieve env value
 *
 * @public
 * @param envName - Name of env to retrieve
 * @param defaultValue - Default value if not exists
 * @returns - Env value
 * @throws {Error} - Env has not yet initialized.
 */
export declare function env(envName: string, defaultValue?: string): string;
export declare namespace env {
    var int: (envName: string, defaultValue?: number | undefined) => number | undefined;
    var bool: (envName: string, defaultValue?: boolean | undefined) => boolean | undefined;
}
