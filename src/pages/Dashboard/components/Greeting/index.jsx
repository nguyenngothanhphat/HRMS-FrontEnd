import React from 'react';
import { formatMessage } from 'umi';
import s from './index.less';

const Greeting = (props) => {
  const { name = '' } = props;

  return (
    <div className={s.container}>
      <h1>
        {formatMessage({ id: 'pages.dashboard.greeting.hello' })} {name}!
      </h1>
      {/* <p>
        You have <span>7 activities </span> today and <span>16 notifications</span>
      </p> */}
    </div>
  );
};

export default Greeting;
