import { useContext, useEffect, useState } from 'react';
import RSocketContext from '../contexts/RSocketContext';

// const { MAX_REQUEST_N } = require('@rsocket/rsocket-core');

function useFriends() {
  const [, rsocket] = useContext(RSocketContext);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const requestPayload = {
      data: Buffer.from([]),
      metadata: Buffer.from(
        JSON.stringify({
          route: 'FriendsService.getFriends',
        })
      ),
    };

    const cancellable = rsocket.requestResponse(requestPayload, {
      onError(_error) {
        setError(_error);
      },
      onNext: (payload) => {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const data = JSON.parse(payload.data.toString());
        setData(data);
      },
      onComplete() {},
    });

    return () => {
      cancellable.cancel();
    };
  }, [rsocket]);

  return [data, error];
}

export default useFriends;
