import moment from 'moment';
import React from 'react';
import { connect } from 'umi';
import NextIcon from '@/assets/timeSheet/next02.svg';
import PrevIcon from '@/assets/timeSheet/prev02.svg';
import { DATE_FORMAT_MDY } from '@/constants/dateFormat';
import { isTheSameDay } from '@/utils/timeSheet';
import styles from './index.less';

const DateSwitcher = (props) => {
  const {
    dates = [],
    onPrevWeekClick = () => {},
    onNextWeekClick = () => {},
    selectedDate = '',
    setSelectedDate = () => {},
    importingIds = [],
  } = props;

  const getSelectedNumber = (d) => {
    const find = importingIds.find((v) => isTheSameDay(v.date, d));
    if (find) return find.selectedIds.length;
    return 0;
  };

  return (
    <div className={styles.DateSwitcher}>
      <img className={styles.prevIcon} src={PrevIcon} alt="" onClick={onPrevWeekClick} />
      <div className={styles.dates}>
        {dates.map((d) => {
          const dateName = moment(d, DATE_FORMAT_MDY).locale('en').format('ddd');
          const dateNumber = moment(d, DATE_FORMAT_MDY).locale('en').format('DD');
          const isSelected =
            moment(selectedDate).format(DATE_FORMAT_MDY) === moment(d).format(DATE_FORMAT_MDY);
          const count = getSelectedNumber(d);
          return (
            <div
              className={`${styles.dateItem} ${count !== 0 ? styles.hasValueDate : ''} ${
                isSelected ? styles.currentDate : ''
              } `}
              onClick={() => setSelectedDate(moment(d))}
            >
              <span className={styles.dateName}>{dateName}</span>
              <div className={styles.dateNumber}>
                <div className={styles.icon}>
                  <span>{dateNumber}</span>
                </div>
                {count !== 0 && (
                  <div className={styles.badgeNumber}>
                    <span>{count}</span>
                  </div>
                )}
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
