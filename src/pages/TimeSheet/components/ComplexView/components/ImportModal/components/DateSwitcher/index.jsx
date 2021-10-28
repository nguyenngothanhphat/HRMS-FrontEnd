import React from 'react';
import { connect } from 'umi';
import moment from 'moment';
import NextIcon from '@/assets/timeSheet/next02.svg';
import PrevIcon from '@/assets/timeSheet/prev02.svg';
import styles from './index.less';

const DateSwitcher = (props) => {
  const {
    dates = [],
    onPrevWeekClick = () => {},
    onNextWeekClick = () => {},
    selectedDate = '',
    setSelectedDate = () => {},
  } = props;

  return (
    <div className={styles.DateSwitcher}>
      <img className={styles.prevIcon} src={PrevIcon} alt="" onClick={onPrevWeekClick} />
      <div className={styles.dates}>
        {dates.map((d) => {
          const dateName = moment(d, 'MM/DD/YYYY').locale('en').format('ddd');
          const dateNumber = moment(d, 'MM/DD/YYYY').locale('en').format('DD');
          const isSelected =
            moment(selectedDate).format('MM/DD/YYYY') === moment(d).format('MM/DD/YYYY');
          return (
            <div
              className={`${styles.dateItem} ${isSelected ? styles.currentDate : ''}`}
              onClick={() => setSelectedDate(moment(d))}
            >
              <span className={styles.dateName}>{dateName}</span>
              <div className={styles.dateNumber}>
                <div className={styles.icon}>
                  <span>{dateNumber}</span>
                </div>
                <div className={styles.badgeNumber}>
                  <span>3</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <img className={styles.nextIcon} src={NextIcon} alt="" onClick={onNextWeekClick} />
    </div>
  );
};

// export default DateSwitcher;
export default connect(() => ({}))(DateSwitcher);
