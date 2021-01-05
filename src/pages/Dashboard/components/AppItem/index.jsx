import React from 'react';
// import { ReactComponent as MyIcon } from '@/assets/dashboard_date.svg';
import { ReactComponent as PlusIcon } from '@/assets/dashboard_plus.svg';
import { Link } from 'umi';
import s from './index.less';

const AppItem = (props) => {
  const { Icon = '', name = '', add = false, link, showMore = () => {} } = props;
  if (add) {
    return (
      <div className={s.container} onClick={showMore}>
        <div className={s.circleAdd}>
          <PlusIcon />
        </div>
        <span>Add an app</span>
      </div>
    );
  }
  return (
    <Link to={link || undefined}>
      <div className={s.container}>
        <div className={s.circle}>
          {/* <MyIcon /> */}
          {Icon}
        </div>
        <span>{name}</span>
      </div>
    </Link>
  );
};

export default AppItem;
