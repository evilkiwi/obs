import { Sha256 } from '@aws-crypto/sha256-browser';

export const hash = async (salt: string, challenge: string, password: string) => {
    const hash = new Sha256();
    hash.update(password);
    hash.update(salt);
    const resultingHash = await hash.digest();

    const binHash = Array.prototype.map.call(resultingHash, (ch: any) => String.fromCharCode(ch)).join('');

    const passwordHash = new Sha256();
    passwordHash.update(btoa(binHash));
    passwordHash.update(challenge);
    const result = await passwordHash.digest();

    const bin = Array.prototype.map.call(result, (ch: any) => String.fromCharCode(ch)).join('');

    return btoa(bin);
};

export const websocket = async (host: string, port: number, secure = false, timeoutDelay = 3000) => new Promise<WebSocket>((resolve, reject) => {
    const failed = () => reject(new Error('connection failed'));
    const timeout = setTimeout(() => failed(), timeoutDelay);
    const ws = new WebSocket(`ws${secure ? 's' : ''}://${host}:${port}`);

    ws.onopen = () => {
        ws.onopen = null;
        ws.onerror = null;
        clearTimeout(timeout);
        resolve(ws);
    };
    ws.onerror = () => {
        clearTimeout(timeout);
        failed();
    };
});

export const rand = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const camelCaseObj = (data: Record<string, unknown>) => {
    const keys = Object.keys(data);
    const total = keys.length;
    const output: typeof data = {};

    for (let i = 0; i < total; i++) {
        output[keys[i]] = data[keys[i]];
        output[camelCase(keys[i])] = data[keys[i]];
    }

    return output;
};

export const camelCase = (input: string) => {
    return input.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
};
