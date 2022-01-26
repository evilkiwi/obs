import type { Emitter } from 'nanoevents';

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
    events?: Emitter;
}

export * from './events';
