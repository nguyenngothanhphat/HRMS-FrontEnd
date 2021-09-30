import { Col, Row, Tooltip } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import EditIcon from '@/assets/timeSheet/edit.svg';
import DeleteIcon from '@/assets/timeSheet/del.svg';
import { activityColor, hourFormat } from '@/utils/timeSheet';
import styles from './index.less';
import EditCard from '../EditCard';

const ActivityCard = (props) => {
  const {
    card: {
      _id = '',
      activity = '',
      timeIn = '',
      timeOut = '',
      nightshift = false,
      totalHours = '',
      notes = '',
    } = {},
    card = {},
    cardDay = '',
    dispatch,
  } = props;
  const [editMode, setEditMode] = useState(false);

  // FUNCTION AREA
  const handleLongString = (str) => {
    if (str.length <= 72) return str;
    return `${str.slice(0, 72)}...`;
  };

  const renderNote = () => {
    if (notes.length <= 72) return notes;
    return (
      <span>
        {handleLongString(notes)}{' '}
        <Tooltip
          title={notes}
          placement="bottomLeft"
          // we have this prop for customizing antd tooltip
          getPopupContainer={(trigger) => {
            return trigger;
          }}
        >
          <span className={styles.readMoreBtn}>Read More</span>
        </Tooltip>
      </span>
    );
  };

  const getActivityBackgroundColor = (activityName) => {
    const find = activityColor.find((a) => a.name === activityName);
    return find?.color;
  };

  // main handle
  const onEditCard = () => {
    setEditMode(true);
  };

  const onRemoveCard = () => {
    dispatch({
      type: 'timeSheet/removeActivityEffect',
      payload: {
        _id,
      },
    });
  };

  // MAIN AREA
  if (editMode)
    return <EditCard card={card} onCancelCard={() => setEditMode(false)} cardDay={cardDay} />;
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
            <span>
              {typeof activity === 'string' && activity.length > 0 ? activity.charAt(0) : 'A'}
            </span>
          </div>
          {activity || ''}
        </Col>
        <Col span={3} className={styles.normalCell}>
          {timeIn ? moment(timeIn).format(hourFormat) : ''}
        </Col>
        <Col span={3} className={styles.normalCell}>
          {timeOut ? moment(timeOut).format(hourFormat) : ''}
        </Col>
        <Col span={3} className={styles.normalCell}>
          {nightshift ? 'Yes' : 'No'}
        </Col>
        <Col span={3} className={`${styles.normalCell} ${styles.blueText}`}>
          {totalHours || ''}
        </Col>
        <Col span={6} className={styles.normalCell}>
          {renderNote()}
        </Col>
        <Col span={3} className={`${styles.normalCell} ${styles.alignCenter}`}>
          <div className={styles.actionsButton}>
            <img src={EditIcon} onClick={onEditCard} alt="" />
            <img src={DeleteIcon} onClick={onRemoveCard} alt="" />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default connect(({ timeSheet: { myTimesheet = [] } = {} }) => ({ myTimesheet }))(
  ActivityCard,
);
