import React from 'react';
import { connect } from 'umi';
import CustomOrangeButton from '@/components/CustomOrangeButton';
import CustomRangePicker from '@/pages/TimeSheet/components/ComplexView/components/CustomRangePicker';
import SearchBar from '@/pages/TimeSheet/components/ComplexView/components/SearchBar';
import styles from './index.less';

const Header = (props) => {
  const { startDate, endDate, onChangeSearch = () => {} } = props;

  // MAIN AREA
  return (
    <div className={styles.Header}>
      <div className={styles.Header__left}>
        <CustomRangePicker startDate={startDate} endDate={endDate} disabled />
      </div>
      <div className={styles.Header__right}>
        <CustomOrangeButton />
        <SearchBar onChangeSearch={onChangeSearch} />
      </div>
    </div>
  );
};

export default connect(() => ({}))(Header);
