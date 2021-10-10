import React, { useEffect, useRef, useState } from 'react';
import RSocketContext from './RSocketContext';

const { RSocketConnector } = require('@rsocket/rsocket-core');
const {
  WebsocketClientTransport,
} = require('@rsocket/rsocket-websocket-client');

const RSocketProvider = (props) => {
  // eslint-disable-next-line react/prop-types
  const { children } = props;
  const [connectionState, setConnectionState] = useState('CONNECTING');
  const rsocket = useRef(null);

  useEffect(() => {
    let connector;
    const connect = async () => {
      connector = new RSocketConnector({
        transport: new WebsocketClientTransport({
          // url: 'ws://localhost:9090',
          url: 'ws://localhost:8000/friends-service',
        }),
      });

      try {
        rsocket.current = await connector.connect();
        setConnectionState('CONNECTED');
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        setConnectionState('ERROR');
      }
    };

    connect();

    return () => {
      rsocket?.current?.close();
    };
  }, []);

  return (
    <RSocketContext.Provider value={[connectionState, rsocket.current]}>
      {children}
    </RSocketContext.Provider>
  );
};

export default RSocketProvider;
