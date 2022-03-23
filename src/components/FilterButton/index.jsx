import React from 'react';
import { Badge } from 'antd';
import FilterIcon from '@/assets/directory/filter.svg';
import styles from './index.less';

const FilterButton = (props) => {
  const { onClick = () => {}, fontSize = 13, showDot = false } = props;

  return (
    <div className={styles.FilterButton} onClick={onClick}>
      <img src={FilterIcon} alt="" />
      <span style={{ fontSize: `${fontSize}px` }}>Filter</span>
      {showDot && (
        <Badge dot offset={[-3, -8]}>
          <div className={styles.dot} />
        </Badge>
      )}
    </div>
  );
};
export default FilterButton;
