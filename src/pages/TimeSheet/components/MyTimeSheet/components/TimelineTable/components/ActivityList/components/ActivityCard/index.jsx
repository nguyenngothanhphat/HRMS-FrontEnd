import { Col, Row, Tooltip } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import DeleteIcon from '@/assets/timeSheet/del.svg';
import EditIcon from '@/assets/timeSheet/edit.svg';
import {
  activityColor,
  convertMsToTime,
  dateFormatAPI,
  MT_SECONDARY_COL_SPAN,
} from '@/utils/timeSheet';
import EditCard from '../EditCard';
import styles from './index.less';
import { getCurrentCompany } from '@/utils/authority';

const { ACTIVITY, START_TIME, END_TIME, NIGHT_SHIFT, TOTAL_HOURS, NOTES, ACTIONS } =
  MT_SECONDARY_COL_SPAN;

const ActivityCard = (props) => {
  const {
    card: {
      id = '',
      taskName = '',
      startTime = '',
      endTime = '',
      nightShift = false,
      // totalHours = '',
      duration = 0,
      notes = '',
    } = {},
    card = {},
    cardDay = '',
    dispatch,
  } = props;
  const { employee: { _id: employeeId = '' } = {} } = props;

  const [editMode, setEditMode] = useState(false);

  // FUNCTION AREA
  const handleLongString = (str) => {
    if (str.length <= 72) return str;
    return `${str.slice(0, 72)}...`;
  };

  const renderNote = (note = '') => {
    if (note.length <= 72) return note;
    return (
      <span>
        {handleLongString(note)}{' '}
        <Tooltip
          title={note}
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
        id,
        employeeId,
        companyId: getCurrentCompany(),
      },
      date: moment(cardDay).format(dateFormatAPI),
    });
  };

  // MAIN AREA
  if (editMode)
    return <EditCard card={card} onCancelCard={() => setEditMode(false)} cardDay={cardDay} />;
  return (
    <div className={styles.ActivityCard}>
      <Row gutter={[12, 0]}>
        <Col span={ACTIVITY} className={`${styles.normalCell} ${styles.boldText}`}>
          <div
            className={styles.activityIcon}
            style={
              getActivityBackgroundColor(taskName)
                ? { background: getActivityBackgroundColor(taskName) }
                : null
            }
          >
            <span>{taskName ? taskName.toString()?.charAt(0) : 'A'}</span>
          </div>
          {taskName || ''}
        </Col>
        <Col span={START_TIME} className={styles.normalCell}>
          {startTime}
        </Col>
        <Col span={END_TIME} className={styles.normalCell}>
          {endTime}
        </Col>
        <Col span={NIGHT_SHIFT} className={styles.normalCell}>
          {nightShift ? 'Yes' : 'No'}
        </Col>
        <Col span={TOTAL_HOURS} className={`${styles.normalCell} ${styles.blueText}`}>
          {convertMsToTime(duration)}
        </Col>
        <Col span={NOTES} className={styles.normalCell}>
          {renderNote(notes || '')}
        </Col>
        <Col span={ACTIONS} className={`${styles.normalCell} ${styles.alignCenter}`}>
          <div className={styles.actionsButton}>
            <img src={EditIcon} onClick={onEditCard} alt="" />
            <img src={DeleteIcon} onClick={onRemoveCard} alt="" />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default connect(({ user: { currentUser: { employee = {} } = {} } }) => ({ employee }))(
  ActivityCard,
);
