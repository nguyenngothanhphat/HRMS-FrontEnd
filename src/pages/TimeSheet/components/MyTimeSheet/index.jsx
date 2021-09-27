import React from 'react';
import { DatePicker } from 'antd';
import { MinusOutlined } from '@ant-design/icons';
import { connect } from 'umi';

import PrevIcon from '@/assets/timeSheet/prev.svg';
import NextIcon from '@/assets/timeSheet/next.svg';
import styles from './index.less';

const { RangePicker } = DatePicker;
const datePickerFormat = 'ddd, MMM D, YYYY';
// Mon, Sep 12, 2021 - Sun, Sep 18, 2021
const MyTimeSheet = () => {
  // HEADER
  const _renderHeader = () => {
    return (
      <div className={styles.header}>
        <div className={styles.header__left}>
          <div className={styles.prevWeek}>
            <img src={PrevIcon} alt="" />
          </div>
          <div className={styles.rangePicker}>
            <RangePicker
              format={datePickerFormat}
              separator={<MinusOutlined className={styles.minusSeparator} />}
            />
          </div>
          <div className={styles.nextWeek}>
            <img src={NextIcon} alt="" />
          </div>
        </div>
        <div className={styles.header__right}>
          Total hours: <span className={styles.hours}>40:40:00</span>
        </div>
      </div>
    );
  };

  // TABLE CONTENT
  const _renderContent = () => {
    return <div className={styles.content}>TABLE</div>;
  };

  return (
    <div className={styles.MyTimeSheet}>
      {_renderHeader()}
      {_renderContent()}
    </div>
  );
};

export default connect(() => ({}))(MyTimeSheet);
