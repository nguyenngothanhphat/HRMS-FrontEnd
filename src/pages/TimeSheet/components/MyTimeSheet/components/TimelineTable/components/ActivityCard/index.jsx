import { Col, Row } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';
import EditIcon from '@/assets/timeSheet/edit.svg';
import DeleteIcon from '@/assets/timeSheet/del.svg';
import styles from './index.less';

const ActivityCard = (props) => {
  const {
    activity: {
      activity = '',
      timeIn = '',
      timeOut = '',
      nightshift = false,
      totalHours = '',
      notes = '',
    } = {},
  } = props;
  const [readMore, setReadMore] = useState(false);

  // FUNCTION AREA
  const handleLongString = (str) => {
    if (str.length <= 72) return str;
    return `${str.slice(0, 72)}...`;
  };

  const renderNote = () =>
    notes.length > 72 && !readMore ? (
      <span>
        {handleLongString(notes)}{' '}
        <span className={styles.readMoreBtn} onClick={() => setReadMore(true)}>
          Read More
        </span>
      </span>
    ) : (
      notes
    );

  // MAIN AREA
  return (
    <Row className={styles.ActivityCard}>
      <Col span={3} className={styles.normalCell}>
        {activity}
      </Col>
      <Col span={3} className={styles.normalCell}>
        {timeIn}
      </Col>
      <Col span={3} className={styles.normalCell}>
        {timeOut}
      </Col>
      <Col span={3} className={styles.normalCell}>
        {nightshift ? 'Yes' : 'No'}
      </Col>
      <Col span={3} className={styles.normalCell}>
        {totalHours}
      </Col>
      <Col span={6} className={styles.normalCell}>
        {renderNote()}
      </Col>
      <Col span={3} className={`${styles.normalCell} ${styles.alignCenter}`}>
        <div className={styles.actionsButton}>
          <img src={DeleteIcon} alt="" />
          <img src={EditIcon} alt="" />
        </div>
      </Col>
    </Row>
  );
};

export default connect(({ timeSheet: { myTimesheet = [] } = {} }) => ({ myTimesheet }))(
  ActivityCard,
);
