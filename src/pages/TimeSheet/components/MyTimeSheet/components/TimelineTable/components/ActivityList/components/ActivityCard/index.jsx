import { Col, Row } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';
import EditIcon from '@/assets/timeSheet/edit.svg';
import DeleteIcon from '@/assets/timeSheet/del.svg';
import { activityColor } from '@/utils/timeSheet';
import styles from './index.less';
import EditCard from '../EditCard';

const ActivityCard = (props) => {
  const {
    card: {
      activity = '',
      timeIn = '',
      timeOut = '',
      nightshift = false,
      totalHours = '',
      notes = '',
    } = {},
    card = {},
  } = props;
  const [readMore, setReadMore] = useState(false);
  const [editMode, setEditMode] = useState(false);

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

  const getActivityBackgroundColor = (activityName) => {
    const find = activityColor.find((a) => a.name === activityName);
    return find?.color;
  };

  // MAIN AREA
  if (editMode) return <EditCard card={card} onCancelCard={() => setEditMode(false)} />;
  return (
    <div className={styles.ActivityCard}>
      <Row gutter={[12, 0]}>
        <Col span={3} className={`${styles.normalCell} ${styles.boldText}`}>
          <div
            className={styles.activityIcon}
            style={
              getActivityBackgroundColor(activity)
                ? { background: getActivityBackgroundColor(activity) }
                : null
            }
          >
            <span>{activity.charAt(0)}</span>
          </div>
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
        <Col span={3} className={`${styles.normalCell} ${styles.blueText}`}>
          {totalHours}
        </Col>
        <Col span={6} className={styles.normalCell}>
          {renderNote()}
        </Col>
        <Col span={3} className={`${styles.normalCell} ${styles.alignCenter}`}>
          <div className={styles.actionsButton}>
            <img src={EditIcon} onClick={() => setEditMode(true)} alt="" />
            <img src={DeleteIcon} alt="" />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default connect(({ timeSheet: { myTimesheet = [] } = {} }) => ({ myTimesheet }))(
  ActivityCard,
);
