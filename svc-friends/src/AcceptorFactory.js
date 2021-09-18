function decodePayload(payload) {
    const data = payload.data || Buffer.from('{}');
    const metadata = payload.metadata || Buffer.from('{}');

    return {
        data: JSON.parse(data.toString()),
        metadata: JSON.parse(metadata.toString())
    };
}

const routeRegistry = {
    registry: {},
    registerService(service) {
        service.routes.forEach((route) => {
            this.registry[route.name] = route;
        });
    },
    get(route) {
        return this.registry[route];
    }
};

const friendsService = new FriendsService();

routeRegistry.registerService(tickerService);

module.exports = function makeAcceptor() {
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
                    const route = metadata.route;

                    if (!route || typeof route !== 'string') {
                        const error = new Error('invalid route');
                        return responder.onError(error);
                    }

                    const subscription = routeRegistry
                        .get(route)
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
                }
            };
        },
    };
}
