import { createLogger } from '@tnotifier/logger';
import { createNanoEvents } from 'nanoevents';
import type { AsyncRegistry, Events, Options } from '@/types';
import { camelCaseObj, hash, rand } from '@/helpers';
import { connect } from '@/client';

export const obs = async (options: Options = {}) => {
    const { host, port, secure, password, debug }: Options = {
        host: 'localhost',
        port: 4444,
        secure: false,
        debug: false,
        ...options,
    };

    const events = createNanoEvents<Events>();
    const logger = createLogger({ name: 'obs' });

    if (!debug) {
        logger.setDisabled(true);
    }

    logger.debug('attempting to connect');
    const ws = await connect(host, [port], secure);
    logger.debug('successfully connected');

    // Registry to hold in-progress Promises.
    const async: AsyncRegistry = {};

    // Parser for incoming payloads.
    const processMessage = (data: any) => {
        data = camelCaseObj(data);

        const id: string|undefined = data.messageId;
        const update: string|undefined = data.updateType;

        if (id !== undefined && id.length > 0) {
            if (!async[id]) {
                return;
            }

            const asyncItem = async[id];

            window.clearTimeout(asyncItem.timeout);

            if (data.status === 'error') {
                asyncItem.reject(data as Error);
            } else {
                asyncItem.resolve(data);
            }

            logger.debug(`resolved async request \`${id}\``);

            delete async[id];
        } else if (update !== undefined) {
            events.emit(update, data);
        }
    };

    // Bind the WebSocket Event parser.
    ws.addEventListener('message', ({ data }) => {
        try {
            data = JSON.parse(data);
            processMessage(data);
        } catch {
            // Ignore malformed payloads.
        }
    });

    // Helper functions to return.
    const send = (payload: object) => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(payload));
        }
    };

    const request = (type: string, payload?: object) => new Promise((resolve, reject) => {
        const id = rand(1, 100000);

        async[id] = {
            resolve,
            reject,
            timeout: window.setTimeout(() => {
                delete async[id];
                logger.error(`async request \`${id}\` timed out`);
                reject(new Error('timed out'));
            }, 5000),
        };

        const message = {
            'message-id': `${id}`,
            'request-type': type,
            ...(payload ?? {}),
        };

        logger.debug(`sending async request \`${id}\``, message);

        send(message);
    });

    const disconnect = () => {
        logger.debug('disconnecting');
        ws.close();
    };

    // Check if we require authentication.
    const auth = (await request('GetAuthRequired') as any);

    if (auth.authRequired) {
        if (!password) {
            throw new Error('please supply a password');
        }

        logger.debug('requires auth - sending');

        try {
            const passwordHash = await hash(auth.salt, auth.challenge, password);

            await request('Authenticate', {
                auth: passwordHash,
            });
            logger.debug('authenticated successfully');
        } catch (e) {
            logger.error('could not authenticate', e);
            throw new Error('authentication failed');
        }
    }

    return { events, send, request, logger, disconnect };
};

export type { Options };
