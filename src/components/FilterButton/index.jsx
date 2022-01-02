import React from 'react';
import FilterIcon from '@/assets/directory/filter.svg';
import styles from './index.less';

const FilterButton = (props) => {
  const { onClick = () => {} } = props;

  return (
    <div className={styles.FilterButton} onClick={onClick}>
      <img src={FilterIcon} alt="" />
      <span>Filter</span>
    </div>
  );
};
export default FilterButton;
