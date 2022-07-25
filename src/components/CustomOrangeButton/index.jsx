import React from 'react';
import { Badge } from 'antd';
import FilterIcon from '@/assets/directory/filter.svg';
import styles from './index.less';

const CustomOrangeButton = ({
  onClick = () => {},
  fontSize = 13,
  showDot = false,
  icon = '',
  children,
}) => {
  return (
    <div className={styles.CustomOrangeButton} onClick={onClick}>
      <img src={icon || FilterIcon} alt="" />
      <span style={{ fontSize }}>{children || 'Filter'}</span>
      {showDot && (
        <Badge dot offset={[-3, -8]}>
          <div className={styles.dot} />
        </Badge>
      )}
    </div>
  );
};
export default CustomOrangeButton;
