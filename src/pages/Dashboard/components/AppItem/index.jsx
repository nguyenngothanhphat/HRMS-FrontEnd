import React from 'react';
import { Link } from 'umi';
import s from './index.less';

const AppItem = (props) => {
  const { Icon = '', name = '', link } = props;

  return (
    <Link to={link || undefined}>
      <div className={s.container}>
        <div className={s.circle}>{Icon}</div>
        <span>{name}</span>
      </div>
    </Link>
  );
};

export default AppItem;
