const {RSocketServer} = require('@rsocket/rsocket-core');
const {WebsocketServerTransport} = require('@rsocket/rsocket-websocket-server');
const Websocket = require('ws');
const pino = require('pino');
const logger = pino();
const makeAcceptor = require('./AcceptorFactory');

const transport = new WebsocketServerTransport({
    wsCreator: () => {
        return new Websocket.Server({
            port: 9090
        });
    }
});

const server = new RSocketServer({
    transport,
    acceptor: makeAcceptor({ logger })
});

let serverCloseable;

module.exports = {
    start: async function () {
        logger.info('starting server...');
        serverCloseable = await server.bind();
    },
    stop: async function () {
        logger.info('stopping server...');
        serverCloseable.close();
    }
};
