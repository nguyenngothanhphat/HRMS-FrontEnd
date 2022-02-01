import React from 'react';
import FilterIcon from '@/assets/directory/filter.svg';
import styles from './index.less';

const FilterButton = (props) => {
  const { onClick = () => {}, fontSize = 13 } = props;

  return (
    <div className={styles.FilterButton} onClick={onClick}>
      <img src={FilterIcon} alt="" />
      <span style={{ fontSize: `${fontSize}px` }}>Filter</span>
    </div>
  );
};
export default FilterButton;
