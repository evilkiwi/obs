import { websocket } from '@/helpers';

export const connect = async (host = 'localhost', ports = [4444], secure = false) => {
    let connection: WebSocket|undefined;
    let found = false;

    // Find a port OBS WebSocket is running on.
    await (ports ?? []).reduce(async (promise, port) => {
        await promise;

        try {
            if (!found) {
                connection = await websocket(host ?? 'localhost', port, secure);
                found = true;
            }
        } catch {
            // Do nothing - we just want to find an active port.
        }
    }, Promise.resolve());

    if (!connection) {
        throw new Error('could not locate obs websocket server');
    }

    return connection;
};
