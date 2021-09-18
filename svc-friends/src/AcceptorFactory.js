const FriendsService = require('./services/FriendsService');

function decodePayload(payload) {
    const data = payload.data || Buffer.from('{}');
    const metadata = payload.metadata || Buffer.from('{}');

    return {
        data: JSON.parse(data.toString()),
        metadata: JSON.parse(metadata.toString())
    };
}

const routeRegistry = {
    registry: {
        FIRE_AND_FORGET: {},
        REQUEST_RESPONSE: {},
        REQUEST_STREAM: {},
        REQUEST_CHANNEL: {},
    },
    registerService(service) {
        service.routes.forEach((route) => {
            this.registry[route.type][route.name] = route;
        });
    },
    get(route, type) {
        return this.registry[type][route];
    }
};

const friendsService = new FriendsService();

routeRegistry.registerService(friendsService);

module.exports = function makeAcceptor({ logger }) {
    return {
        accept: async (setupPayload, remotePeer) => {
            logger.info(
                `client connected [data: ${setupPayload.data}; metadata: ${setupPayload.metadata}]`
            );

            remotePeer.onClose(() => {
                logger.info('peer disconnected');
            });

            return {
                requestStream(payload, requestN, responder) {

                    const {data, metadata} = decodePayload(payload);
                    const {route} = metadata;

                    if (!route || typeof route !== 'string') {
                        const error = new Error('invalid route');
                        return responder.onError(error);
                    }

                    const subscription = routeRegistry
                        .get(route, "REQUEST_STREAM")
                        .handle({data, metadata, requestN})
                        .subscribe({
                            next(data) {
                                responder.onNext({
                                    data: Buffer.from(JSON.stringify(data)),
                                    metadata: undefined
                                });
                            },
                            error(e) {
                                logger.error(e);
                                responder.onError(e);
                            },
                            complete() {
                                responder.onComplete();
                            }
                        });

                    return {
                        cancel() {
                            logger.info('stream canceled');
                            subscription.unsubscribe();
                        }
                    };
                },
                requestResponse(payload, responder) {
                    const {data, metadata} = decodePayload(payload);
                    const {route} = metadata;

                    if (!route || typeof route !== 'string') {
                        const error = new Error('invalid route');
                        return responder.onError(error);
                    }

                    const handler = routeRegistry
                        .get(route, 'REQUEST_RESPONSE');

                    const stream = handler.handle({data, metadata});

                    const subscription = stream.subscribe({
                            next(data) {
                                responder.onNext({
                                    data: Buffer.from(JSON.stringify(data)),
                                    metadata: undefined,
                                }, true);
                            },
                            error(e) {
                                logger.error(e);
                                responder.onError(e);
                            },
                            complete() {
                                responder.onComplete();
                            }
                        });

                    return {
                        cancel() {
                            logger.info('stream canceled');
                            subscription.unsubscribe();
                        }
                    };
                }
            };
        },
    };
}
