import { Col, Row, Tooltip } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import DeleteIcon from '@/assets/timeSheet/del.svg';
import EditIcon from '@/assets/timeSheet/edit.svg';
import DuplicateIcon from '@/assets/timeSheet/duplicate.svg';
import ModalImage from '@/assets/timeSheet/modalImage1.png';
import CommonModal from '@/components/CommonModal';
import EditTaskModal from '@/pages/TimeSheet/components/ComplexView/components/EditTaskModal';
import { getCurrentCompany } from '@/utils/authority';
import {
  activityColor,
  convertMsToTime,
  dateFormatAPI,
  EMP_MT_SECONDARY_COL_SPAN,
  EMP_ROW_HEIGHT,
  hourFormat,
} from '@/utils/timeSheet';
import styles from './index.less';
import DuplicateTaskModal from '../DuplicateTaskModal';

const { PROJECT, TASK, DESCRIPTION, TIME, TOTAL_HOURS, ACTIONS } = EMP_MT_SECONDARY_COL_SPAN;
const ORIGINAL_TEXT_LONG = 48;

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
    startWorkingHour = '',
    endWorkingHour = '',
    dispatch,
    isOldTimeSheet = false,
  } = props;

  const { employee: { _id: employeeId = '' } = {} } = props;

  const [top, setTop] = useState(0);
  const [height, setHeight] = useState(0);
  const [textLong, setTextLong] = useState(ORIGINAL_TEXT_LONG);

  // modals
  const [removeModalVisible, setRemoveModalVisible] = useState(false);
  const [editTaskModalVisible, setEditTaskModalVisible] = useState(false);
  const [duplicateTaskModalVisible, setDuplicateTaskModalVisible] = useState(false);

  // USE EFFECT AREA
  const calculateCardPosition = () => {
    const marginBlock = 8;

    let topTemp = EMP_ROW_HEIGHT / 2;
    let heightTemp = 0;

    if (startTime && endTime) {
      const startTimeHourTemp = moment(startTime, 'HH:mm').hour();
      const startTimeMinuteTemp = moment(startTime, 'HH:mm').minute();

      for (let i = startWorkingHour; i <= endWorkingHour; i += 1) {
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
      // calculate "description" with read more button
      if (heightTemp > EMP_ROW_HEIGHT) {
        const textLongTemp =
          ORIGINAL_TEXT_LONG * (heightTemp / EMP_ROW_HEIGHT) + ORIGINAL_TEXT_LONG * 2;
        setTextLong(parseInt(textLongTemp, 10));
      }
    }
  };

  useEffect(() => {
    if (!isOldTimeSheet) {
      calculateCardPosition();
    }
  }, [JSON.stringify(card), startWorkingHour]);

  // FUNCTION AREA
  const handleLongString = (str) => {
    if (str.length <= textLong) return str;
    return `${str.slice(0, textLong)}...`;
  };

  const renderDescription = (text = '') => {
    if (text.length <= textLong) return text;
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
      setRemoveModalVisible(false);
      refreshTable();
    }
  };

  // MAIN AREA
  return (
    <div
      className={height < EMP_ROW_HEIGHT / 2 ? styles.ActivityCard_hover : styles.ActivityCard}
      style={
        isOldTimeSheet
          ? {
              height: '60px',
              position: 'relative',
              marginBlock: '12px',
            }
          : {
              top,
              height,
            }
      }
    >
      <Row
        gutter={[12, 12]}
        className={styles.container}
        align="top"
        style={{
          paddingBlock: height < EMP_ROW_HEIGHT / 2 ? 3 : 10,
        }}
      >
        <Col span={PROJECT} className={`${styles.flexCell} ${styles.boldText}`}>
          <div
            className={styles.activityIcon}
            style={
              getActivityBackgroundColor(projectName)
                ? { background: getActivityBackgroundColor(projectName) }
                : null
            }
          >
            <span>{projectName ? projectName.toString()?.charAt(0) : 'P'}</span>
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
          {startTime ? moment(startTime, 'HH:mm').format(hourFormat) : ''}
          {endTime ? ` - ${moment(endTime, 'HH:mm').format(hourFormat)}` : ''}
        </Col>
        <Col span={TOTAL_HOURS} className={`${styles.normalCell} ${styles.blueText}`}>
          {convertMsToTime(duration)}
        </Col>
        <Col span={ACTIONS} className={`${styles.flexCell} ${styles.alignCenter}`}>
          <div className={styles.actionsButton}>
            <img src={EditIcon} alt="" onClick={() => setEditTaskModalVisible(true)} />
            <img src={DuplicateIcon} alt="" onClick={() => setDuplicateTaskModalVisible(true)} />
            <img src={DeleteIcon} onClick={() => setRemoveModalVisible(true)} alt="" />
          </div>
        </Col>
      </Row>

      <CommonModal
        visible={removeModalVisible}
        onClose={() => setRemoveModalVisible(false)}
        firstText="Yes"
        width={400}
        onFinish={onRemoveCard}
        hasHeader={false}
        content={
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              padding: 24,
              flexDirection: 'column',
              alignItems: 'center',
            }}
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
          </div>
        }
      />
      <DuplicateTaskModal
        id={id}
        task={card}
        visible={duplicateTaskModalVisible}
        onClose={() => setDuplicateTaskModalVisible(false)}
        refreshTable={refreshTable}
      />

      <EditTaskModal
        task={card}
        date={cardDay}
        visible={editTaskModalVisible}
        onClose={() => setEditTaskModalVisible(false)}
      />
    </div>
  );
};

export default connect(({ user: { currentUser: { employee = {} } = {} } }) => ({ employee }))(
  ActivityCard,
);
