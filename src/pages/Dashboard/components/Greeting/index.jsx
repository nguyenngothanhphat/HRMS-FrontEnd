import React from 'react';
import { formatMessage } from 'umi';
import s from './index.less';

const Greeting = (props) => {
  const { name = '', currentLocation = '' } = props;
  return (
    <div className={s.container}>
      <h1>
        {formatMessage({ id: 'pages.dashboard.greeting.hello' })} {name}!
      </h1>
      {currentLocation && <p>Current location: {currentLocation}</p>}
    </div>
  );
};

export default Greeting;
