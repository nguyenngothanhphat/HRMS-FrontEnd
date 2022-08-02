import * as React from 'react';
import { CancelToken, isCancel } from 'axios';

const useCancelToken = () => {
  const axiosSource = React.useRef(null);

  const cancelToken = () => {
    axiosSource.current = CancelToken.source();
    return axiosSource.current.token;
  };

  const cancelRequest = (message) => {
    if (axiosSource.current) axiosSource.current.cancel(message);
  };

  React.useEffect(() => cancelRequest, []);

  return { cancelToken, cancelRequest, isCancel };
};

export default useCancelToken;
