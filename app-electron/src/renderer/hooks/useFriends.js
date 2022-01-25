import { useContext, useEffect, useState } from 'react';
import { RxRequestersFactory } from '@rsocket/adapter-rxjs';
import { firstValueFrom, timeout } from 'rxjs';
import RSocketContext from '../contexts/RSocketContext';
import JSONCodec from '../rsocket/JsonCodec';

const jsonCodec = new JSONCodec();

function useFriends() {
  const [, requester] = useContext(RSocketContext);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [state, setState] = useState('LOADING');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const obs = requester
          .route('FriendsService.getFriends')
          .request(
            RxRequestersFactory.requestResponse({}, jsonCodec, jsonCodec)
          )
          .pipe(timeout({ each: 500 }));
        const friends = await firstValueFrom(obs);
        setData(friends);
        setState('LOADED');
      } catch (e) {
        setError(e);
        setState('ERROR');
      }
    };

    fetchData();

    return () => {};
  }, [requester]);

  return [data, error, state];
}

export default useFriends;
