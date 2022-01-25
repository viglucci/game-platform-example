import React, { useEffect, useRef, useState } from 'react';
import { RSocketRequester } from '@rsocket/messaging';
import { RSocketConnector } from '@rsocket/core';
import { WebsocketClientTransport } from '@rsocket/transport-websocket-client';
import RSocketContext from './RSocketContext';

const RSocketProvider = (props) => {
  // eslint-disable-next-line react/prop-types
  const { children } = props;
  const [connectionState, setConnectionState] = useState('CONNECTING');
  const requesterRef = useRef(null);
  const rsocketRef = useRef(null);

  useEffect(() => {
    let connector;
    const connect = async () => {
      connector = new RSocketConnector({
        transport: new WebsocketClientTransport({
          url: 'ws://localhost:9090',
          // url: 'ws://localhost:8000/friends-service',
        }),
        setup: {
          keepAlive: 10000,
          lifetime: 30000,
        },
      });

      try {
        rsocketRef.current = await connector.connect();
        requesterRef.current = RSocketRequester.wrap(rsocketRef.current);
        setConnectionState('CONNECTED');
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        setConnectionState('ERROR');
      }
    };

    connect();

    return () => {
      rsocketRef?.current?.close();
      rsocketRef.current = null;
    };
  }, [rsocketRef]);

  return (
    <RSocketContext.Provider value={[connectionState, requesterRef.current]}>
      {children}
    </RSocketContext.Provider>
  );
};

export default RSocketProvider;
