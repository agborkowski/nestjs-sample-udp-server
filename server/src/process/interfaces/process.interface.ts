export enum ProcessPermission {
	UNKNOWN = 'UNKNOWN',
	ALLOW = 'ALLOW',
	DENY = 'DENY',
}

export enum ProcessPermissionMap {
	UNKNOWN = 0,
	ALLOW = 1,
	DENY = 2,
}
export interface IProcess {
	/**
	 * if empty it isn't created
	 */
	readonly id?: number;

	/**
	 * Uppercase process hash by sha256
	 * eg. `561DCE9E49696288A9EE802C0BEF424EB34A1C29B6D8931CCD5C7E26CB4F88EA`
	 */
	readonly hash: string;
	/**
	 * eg. `originalFilename.exe`
	 */
	readonly originalFilename: string;

	/**
	 * eg. `extension`
	 */
	readonly extension: string;

	/**
	 * - `PROCESS_UNKNOWN`
	 * - `PROCESS_ALLOW`
	 * - `PROCESS_DENY`
	 */
	readonly permission: ProcessPermission;

	/**
	 * Admin help materialized activity admin_help:
	 *
	 * `ADMIN_HELP_UNREGISTER` 0
	 * `ADMIN_HELP_START` 1
	 * `ADMIN_HELP_PROCESS` 2
	 * `ADMIN_HELP_END` 3
	 */
	readonly adminHelp: string;

	readonly createdAt?: Date;
	readonly updatedAt?: Date;
}