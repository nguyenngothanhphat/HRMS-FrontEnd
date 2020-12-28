import React from 'react';
import s from './index.less';

const Greeting = (props) => {
  const { name = '' } = props;

  return (
    <div className={s.container}>
      <h1>Hello {name}!</h1>
      <p>
        You have <span>7 activities </span> today and <span>16 notifications</span>
      </p>
    </div>
  );
};

export default Greeting;
