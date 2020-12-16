import React from 'react';
import s from './index.less';

const Greeting = () => {
  return (
    <div className={s.container}>
      <h1>Hello Arun!</h1>
      <p>
        You have <span>7 activities </span> today and <span>16 notifications</span>
      </p>
    </div>
  );
};

export default Greeting;
