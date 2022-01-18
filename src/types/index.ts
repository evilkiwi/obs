export interface AsyncRegistry {
    [id: string]: {
        resolve: (data: unknown) => void;
        reject: (e: Error) => void;
        timeout: number;
    };
}

export interface Options {
    host?: string;
    port?: number;
    secure?: boolean;
    password?: string;
    debug?: boolean;
}

export * from './events';
