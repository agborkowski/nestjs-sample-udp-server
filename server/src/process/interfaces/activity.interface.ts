export enum ActivityRequest {
	ADMIN_HELP = 'ADMIN_HELP',
	CHECK_HASH = 'CHECK_HASH',
	PROCESS_SET_PERMISSION = 'PROCESS_SET_PERMISSION',
}
export enum ActivityRequestMap {
	CHECK_HASH = 0,
	ADMIN_HELP = 1,
	PROCESS_SET_PERMISSION = 2,
}
export enum ActivityResponse {
	PROCESS_UNKNOWN = 'PROCESS_UNKNOWN',
	PROCESS_ALLOW = 'PROCESS_ALLOW',
	PROCESS_DENY = 'PROCESS_DENY',
	ADMIN_HELP_UNREGISTER = 'ADMIN_HELP_UNREGISTER',
	ADMIN_HELP_START = 'ADMIN_HELP_START',
	ADMIN_HELP_PROCESS = 'ADMIN_HELP_PROCESS',
	ADMIN_HELP_END = 'ADMIN_HELP_END',
	ERROR = 'ERROR',
}
export enum ActivityResponseMap {
	PROCESS_UNKNOWN = 0,
	PROCESS_ALLOW = 1,
	PROCESS_DENY = 2,
	ERROR = 9,
}
export enum ActivityResponseAdminHelpMap {
	ADMIN_HELP_UNREGISTER = 0,
	ADMIN_HELP_START = 1,
	ADMIN_HELP_PROCESS = 2,
	ADMIN_HELP_END = 3,
}
export interface IActivity {
	/**
	 * if empty it isn't created
	 */
	readonly id?: number;

	/**
	 * related process hash but should be based on just hash/hash_id
	 */
	readonly process_id?: number | null;

	/**
	 * eg. `fake_guid`
	 */
	readonly guid: string;

	/**
	 * eg. `BIGKOMP`
	 */
	readonly hostname: string;

	/**
	 * eg. `taskhost.exe`
	 */
	readonly filename: string;

	/**
	 * Uppercase process hash by sha256
	 * eg. `561DCE9E49696288A9EE802C0BEF424EB34A1C29B6D8931CCD5C7E26CB4F88EA`
	 */
	readonly hash: string;

	/**
	 * eg. `83.25.91.225`
	 */
	readonly address: string;

	/**
	 * eg: 6667
	 */
	readonly port: string;

	/**
	 * - CLIENT
	 * - SERVER
	 */
	readonly from: string;

	readonly request?: ActivityRequest;
	readonly response?: ActivityResponse;

	readonly createdAt?: Date;
	readonly updatedAt?: Date;
}