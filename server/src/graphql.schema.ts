export enum From {
    SERVER = "SERVER",
    CLIENT = "CLIENT"
}

export enum Permissions {
    NEW = "NEW",
    ALLOW = "ALLOW",
    DENY = "DENY",
    UNKNOWN = "UNKNOWN"
}

export enum Request {
    CHECK_HASH = "CHECK_HASH",
    ADMIN_HELP = "ADMIN_HELP",
    PROCESS_SET_PERMISSION = "PROCESS_SET_PERMISSION"
}

export enum Response {
    PROCESS_UNKNOWN = "PROCESS_UNKNOWN",
    PROCESS_ALLOW = "PROCESS_ALLOW",
    PROCESS_DENY = "PROCESS_DENY",
    ADMIN_HELP_START = "ADMIN_HELP_START",
    ADMIN_HELP_PROCESS = "ADMIN_HELP_PROCESS",
    ADMIN_HELP_END = "ADMIN_HELP_END",
    ERROR = "ERROR"
}

export class ProcessCreateInput {
    hash?: string;
    originalFilename?: string;
    permission?: Permissions;
}

export class ProcessRemoveInput {
    id?: string;
    hash?: string;
}

export class ProcessUpdateInput {
    id?: string;
    adminHelp?: string;
    permission?: string;
}

export class Activity {
    id?: string;
    proces_id?: number;
    guid?: string;
    hostname?: string;
    filename?: string;
    hash?: string;
    address?: string;
    port?: string;
    from?: From;
    request?: Request;
    response?: Response;
    createdAt?: string;
    updatedAt?: string;
}

export abstract class IMutation {
    abstract processCreate(input?: ProcessCreateInput): Process | Promise<Process>;

    abstract processUpdate(input?: ProcessUpdateInput): Process | Promise<Process>;

    abstract processRemove(input?: ProcessRemoveInput): boolean | Promise<boolean>;
}

export class Process {
    id?: string;
    hash?: string;
    originalFilename?: string;
    extension?: string;
    permission?: Permissions;
    adminHelp?: string;
    createdAt?: string;
    updatedAt?: string;
}

export abstract class IQuery {
    abstract activities(): Activity[] | Promise<Activity[]>;

    abstract processes(): Process[] | Promise<Process[]>;

    abstract process(id?: number): Process | Promise<Process>;

    abstract temp__(): boolean | Promise<boolean>;
}

export abstract class ISubscription {
    abstract activityCreated(): Activity | Promise<Activity>;

    abstract processCreated(): Process | Promise<Process>;
}

export type JSON = any;
