import { Col, Row } from 'antd';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import AddIcon from '@/assets/timeSheet/add.svg';
import ActivityCard from './components/ActivityCard';
import AddCard from './components/AddCard';
import styles from './index.less';
import { EMP_MT_MAIN_COL_SPAN } from '@/utils/timeSheet';

const { DATE_OF_HOURS, REMAINING } = EMP_MT_MAIN_COL_SPAN;

const ActivityList = (props) => {
  const { data: { date = '' } = {}, hourList = [] } = props;
  const [cardList, setCardList] = useState([]);

  const onRemoveCard = (index) => {
    const tempList = JSON.parse(JSON.stringify(cardList));
    tempList.splice(index, 1);
    setCardList(tempList);
  };

  const onEditValue = (values, cardIndex) => {
    const tempCardList = JSON.parse(JSON.stringify(cardList));
    tempCardList[cardIndex] = values;
    setCardList(tempCardList);
  };

  // RENDER UI
  const renderHour = (hour) => {
    const hourTemp = `${hour}:00`;
    if (hour < 12) return `${hourTemp} AM`;
    return `${hourTemp} PM`;
  };

  // MAIN AREA
  return (
    <Row className={styles.ActivityList}>
      <Col
        span={DATE_OF_HOURS}
        className={`${styles.ActivityList__firstColumn} ${styles.alignCenter}`}
      >
        {hourList.map((hour) => {
          return (
            <div className={styles.hourBlock}>
              <span>{renderHour(hour)}</span>
            </div>
          );
        })}
      </Col>
      <Col span={REMAINING} className={styles.ActivityList__remainColumn}>
        {hourList.map(() => {
          return (
            <div className={styles.row}>
              <div className={styles.divider} />
            </div>
          );
        })}
      </Col>
    </Row>
  );
};

export default connect(({ timeSheet: { myTimesheet = [] } = {} }) => ({ myTimesheet }))(
  ActivityList,
);
