import { Col, Row } from 'antd';
import moment from 'moment';
import React from 'react';
import { connect } from 'umi';
import { dateFormat, MT_MAIN_COL_SPAN } from '@/utils/timeSheet';
import MemberCard from './components/MemberCard';
import styles from './index.less';

const { DATE, REMAINING } = MT_MAIN_COL_SPAN;

const MemberList = (props) => {
  const { item = {}, activityIndex } = props;

  // MAIN AREA
  return (
    <Row className={styles.MemberList}>
      <Col span={DATE} className={`${styles.MemberList__firstColumn} ${styles.alignCenter}`}>
        <span
          style={
            activityIndex === 0
              ? { display: 'block', marginTop: '10px' }
              : { display: 'block', marginTop: '-18px' }
          }
        >
          {moment(item.date).locale('en').format(dateFormat)}
        </span>
      </Col>
      <Col span={REMAINING} className={styles.MemberList__remainColumn}>
        {item.timesheet.map((activity) => {
          return <MemberCard card={activity} cardDay={item.date} />;
        })}
      </Col>
    </Row>
  );
};

export default connect(({ timeSheet: { myTimesheet = [] } = {} }) => ({ myTimesheet }))(
  MemberList,
);
