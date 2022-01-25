const FriendsService = require("./services/FriendsService");
const { RSocketResponder } = require("@rsocket/messaging");
const { RxRespondersFactory } = require("@rsocket/adapter-rxjs");

function decodePayload(payload) {
  const data = payload.data || Buffer.from("{}");
  const metadata = payload.metadata || Buffer.from("{}");

  return {
    data: JSON.parse(data.toString()),
    metadata: JSON.parse(metadata.toString()),
  };
}

class JSONCodec {
  mimeType = "application/json";

  decode(buffer) {
    return JSON.parse(buffer.toString());
  }

  encode(entity) {
    return Buffer.from(JSON.stringify(entity));
  }
}

const friendsService = new FriendsService();

module.exports = function makeAcceptor({ logger }) {
  return {
    accept: async (setupPayload, remotePeer) => {
      logger.info("peer connected");
      logger.info(JSON.stringify(setupPayload));

      remotePeer.onClose(() => {
        logger.info("peer disconnected");
      });

      const jsonCodec = new JSONCodec();

      const responderBuilder = RSocketResponder.builder();

      friendsService.routes.forEach((route) => {
        let handler;

        switch (route.type) {
          case "REQUEST_RESPONSE": {
            handler = RxRespondersFactory.requestResponse(route.handle, {
              inputCodec: jsonCodec,
              outputCodec: jsonCodec,
            });
          }
        }

        responderBuilder.route(route.name, handler);
      });

      return responderBuilder.build();
    },
  };
};
