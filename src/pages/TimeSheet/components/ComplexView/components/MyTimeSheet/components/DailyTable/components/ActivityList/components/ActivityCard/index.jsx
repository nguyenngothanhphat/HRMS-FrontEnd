import { Col, Row, Tooltip } from 'antd';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import DeleteIcon from '@/assets/timeSheet/del.svg';
import EditIcon from '@/assets/timeSheet/edit.svg';
import ModalImage from '@/assets/timeSheet/modalImage1.png';
import { getCurrentCompany } from '@/utils/authority';
import {
  activityColor,
  convertMsToTime,
  dateFormatAPI,
  hourFormat,
  EMP_MT_SECONDARY_COL_SPAN,
  WORKING_HOURS,
  EMP_ROW_HEIGHT,
} from '@/utils/timeSheet';
import ActionModal from '@/pages/TimeSheet/components/ActionModal';
import EditTaskModal from '@/pages/TimeSheet/components/ComplexView/components/EditTaskModal';
import styles from './index.less';

const { PROJECT, TASK, DESCRIPTION, TIME, TOTAL_HOURS, ACTIONS } = EMP_MT_SECONDARY_COL_SPAN;

const ActivityCard = (props) => {
  const {
    card: {
      id = '',
      projectName = '',
      taskName = '',
      startTime = '',
      endTime = '',
      duration = 0,
      notes: description = '',
    } = {},
    card = {},
    cardDay = '',
    dispatch,
  } = props;
  const { employee: { _id: employeeId = '' } = {} } = props;

  const [top, setTop] = useState(0);
  const [height, setHeight] = useState(0);

  // modals
  const [removeModalVisibe, setRemoveModalVisibe] = useState(false);
  const [editTaskModalVisible, setEditTaskModalVisble] = useState(false);

  // USE EFFECT AREA
  const calculateCardPosition = () => {
    const marginBlock = 10;

    let topTemp = EMP_ROW_HEIGHT / 2;
    let heightTemp = 0;

    if (startTime && endTime) {
      const startTimeHourTemp = moment(startTime, 'HH:mm').hour();
      const startTimeMinuteTemp = moment(startTime, 'HH:mm').minute();

      for (let i = WORKING_HOURS.START; i <= WORKING_HOURS.END; i += 1) {
        if (i < startTimeHourTemp) {
          topTemp += EMP_ROW_HEIGHT;
        } else if (i === startTimeHourTemp) {
          topTemp += (startTimeMinuteTemp / 60) * EMP_ROW_HEIGHT;
        }
      }

      const diff = moment.duration(moment(endTime, 'HH:mm').diff(moment(startTime, 'HH:mm')));

      heightTemp = diff.asHours() * EMP_ROW_HEIGHT;
      setTop(topTemp + marginBlock / 2);
      setHeight(heightTemp - marginBlock);
    }
  };

  useEffect(() => {
    calculateCardPosition();
  }, [JSON.stringify(card)]);

  // FUNCTION AREA
  const handleLongString = (str) => {
    if (str.length <= 72) return str;
    return `${str.slice(0, 72)}...`;
  };

  const renderDescription = (text = '') => {
    if (text.length <= 72) return text;
    return (
      <span>
        {handleLongString(text)}{' '}
        <Tooltip
          title={text}
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

  const refreshTable = () => {
    dispatch({
      type: 'timeSheet/fetchMyTimesheetByTypeEffect',
      isRefreshing: true,
    });
  };
  // main handle
  const onRemoveCard = async () => {
    const res = await dispatch({
      type: 'timeSheet/removeActivityEffect',
      payload: {
        id,
        employeeId,
        companyId: getCurrentCompany(),
      },
      date: moment(cardDay).format(dateFormatAPI),
    });
    if (res.code === 200) {
      setRemoveModalVisibe(false);
      refreshTable();
    }
  };

  // MAIN AREA
  return (
    <div
      className={styles.ActivityCard}
      style={{
        top,
        height,
      }}
    >
      <Row gutter={[12, 0]} className={styles.container}>
        <Col span={PROJECT} className={`${styles.normalCell} ${styles.boldText}`}>
          <div
            className={styles.activityIcon}
            style={
              getActivityBackgroundColor(projectName)
                ? { background: getActivityBackgroundColor(projectName) }
                : null
            }
          >
            <span>{projectName ? projectName.toString()?.charAt(0) : 'A'}</span>
          </div>
          {projectName || ''}
        </Col>
        <Col span={TASK} className={styles.normalCell}>
          {taskName}
        </Col>
        <Col span={DESCRIPTION} className={styles.normalCell}>
          {renderDescription(description)}
        </Col>
        <Col span={TIME} className={`${styles.normalCell} ${styles.blueText}`}>
          {moment(startTime, 'HH:mm').format(hourFormat)} -{' '}
          {moment(endTime, 'HH:mm').format(hourFormat)}
        </Col>
        <Col span={TOTAL_HOURS} className={`${styles.normalCell} ${styles.blueText}`}>
          {convertMsToTime(duration)}
        </Col>
        <Col span={ACTIONS} className={`${styles.normalCell} ${styles.alignCenter}`}>
          <div className={styles.actionsButton}>
            <img src={EditIcon} alt="" onClick={() => setEditTaskModalVisble(true)} />
            <img src={DeleteIcon} onClick={() => setRemoveModalVisibe(true)} alt="" />
          </div>
        </Col>
      </Row>
      <ActionModal
        visible={removeModalVisibe}
        onClose={() => setRemoveModalVisibe(false)}
        buttonText="Yes"
        width={400}
        onFinish={onRemoveCard}
      >
        <img src={ModalImage} alt="" />
        <span style={{ textAlign: 'center' }}>
          Are you sure you want to delete
          <br />
          <span style={{ fontWeight: 'bold' }}>
            {projectName} - {taskName}
          </span>
          ?
        </span>
      </ActionModal>

      <EditTaskModal
        task={card}
        date={cardDay}
        visible={editTaskModalVisible}
        onClose={() => setEditTaskModalVisble(false)}
      />
    </div>
  );
};

export default connect(({ user: { currentUser: { employee = {} } = {} } }) => ({ employee }))(
  ActivityCard,
);
