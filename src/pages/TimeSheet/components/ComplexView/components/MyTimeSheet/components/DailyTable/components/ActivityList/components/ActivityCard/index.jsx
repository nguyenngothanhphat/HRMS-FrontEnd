import { Col, Row, Tooltip } from 'antd';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { connect } from 'umi';
import DeleteIcon from '@/assets/timeSheet/del.svg';
import DuplicateIcon from '@/assets/timeSheet/duplicate.svg';
import EditIcon from '@/assets/timeSheet/edit.svg';
import ModalImage from '@/assets/timeSheet/modalImage2.png';
import CommonModal from '@/components/CommonModal';
import {
  activityColor,
  dateFormatAPI,
  EMP_MT_SECONDARY_COL_SPAN,
  EMP_ROW_HEIGHT,
  hourFormat,
  hourFormatAPI,
} from '@/constants/timeSheet';
import EditTaskModal from '@/pages/TimeSheet/components/ComplexView/components/EditTaskModal';
import { getCurrentCompany } from '@/utils/authority';
import { convertMsToTime } from '@/utils/timeSheet';
import { diffTime } from '@/utils/utils';
import DuplicateTaskModal from '../../../../../../../DuplicateTaskModal';
import styles from './index.less';

const { PROJECT, TASK, DESCRIPTION, TIME, TOTAL_HOURS, ACTIONS } = EMP_MT_SECONDARY_COL_SPAN;
const ORIGINAL_TEXT_LONG = 48;
const marginBlock = 8;

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
      breakTime = 0,
      overTime = 0,
    } = {},
    card = {},
    cardDay = '',
    dispatch,
    isOldTimeSheet = false,
    currentUser: {
      employee: { _id: employeeId = '' } = {} || {},
      employee = {},
      location = {},
    } = {},
  } = props;

  const [top, setTop] = useState(0);
  const [height, setHeight] = useState(0);
  const [textLong, setTextLong] = useState(ORIGINAL_TEXT_LONG);
  const [minutesTop, setMinutesTop] = useState();
  const [minutesBottom, setMinutesBottom] = useState();
  const [selectedTime, setSelectedTime] = useState({});

  // modals
  const [removeModalVisible, setRemoveModalVisible] = useState(false);
  const [editTaskModalVisible, setEditTaskModalVisible] = useState(false);
  const [duplicateTaskModalVisible, setDuplicateTaskModalVisible] = useState(false);

  const resizeRef = useRef();
  const resizeHandleRef = useRef();

  const formatTime = (time) => moment(time, hourFormatAPI).format(hourFormat);

  const boundTopDraggable = -((minutesTop * EMP_ROW_HEIGHT) / 60);
  const boundBottomDraggle = (minutesBottom * EMP_ROW_HEIGHT) / 60;
  const boundTopResize = -(((duration / 1000 / 60 - 15) * (EMP_ROW_HEIGHT / 4)) / 15);
  const timeInfo = selectedTime
    ? `${formatTime(selectedTime?.startTime)} - ${formatTime(selectedTime?.endTime)}`
    : '';
  const durationInfo = convertMsToTime(
    selectedTime ? diffTime(selectedTime?.endTime, selectedTime?.startTime) : duration,
  );
  // USE EFFECT AREA
  const calculateCardPosition = () => {
    let heightTemp = 0;

    if (startTime && endTime) {
      const diff = moment.duration(diffTime(endTime, startTime));

      heightTemp = diff.asHours() * EMP_ROW_HEIGHT;

      setHeight(heightTemp - marginBlock);
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
  }, [JSON.stringify(card)]);

  useEffect(() => {
    if (startTime && endTime) {
      const topMinutes = diffTime(startTime, 0, 'minutes');
      const bottomMinutes = diffTime(24, endTime, 'minutes');
      setMinutesTop(topMinutes);
      setMinutesBottom(bottomMinutes);
      setTop((EMP_ROW_HEIGHT * topMinutes) / 60 + EMP_ROW_HEIGHT / 2 + marginBlock / 2);
      setSelectedTime({ startTime, endTime });
    }
  }, [startTime, endTime]);

  // FUNCTION AREA
  const handleLongString = (str) => {
    if (str.length <= textLong) return str;
    return `${str.slice(0, textLong)}...`;
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
      refreshTable();
    }
  };

  const handleUpdateActivity = async ({ start = startTime, end = endTime }) => {
    const payload = {
      id,
      taskName,
      startTime: start,
      endTime: end,
      employeeId,
      employee: {
        _id: employee._id,
        department: employee.departmentInfo,
        generalInfo: employee.generalInfo,
        manager: {
          _id: employee.managerInfo?._id,
          generalInfo: employee.managerInfo?.generalInfo,
        },
      },
      type: 'TASK',
      companyId: getCurrentCompany(),
      breakTime,
      overTime,
      date: moment(cardDay).format(dateFormatAPI),
      location,
    };

    const response = await dispatch({
      type: 'timeSheet/updateActivityEffect',
      payload,
    });
    refreshTable();
    return response;
  };

  const calculatePositionToTime = (data) => {
    const addMinutes = (time, number) =>
      moment(time, hourFormatAPI).add(number, 'minutes').format(hourFormatAPI);
    // every data y change ===  15'
    const numberOfMinutesChanged = 15 * (data.y / (EMP_ROW_HEIGHT / 4));
    const calculateStartTime = addMinutes(startTime, numberOfMinutesChanged);
    const durationToMinutes = duration / 1000 / 60;
    const calculateEndTime = addMinutes(calculateStartTime, durationToMinutes);
    return {
      start: calculateStartTime,
      end: calculateEndTime === '00:00' ? '24:00' : calculateEndTime,
    };
  };

  const handleResize = (e, data) => {
    e.preventDefault();
    e.target.style.cursor = 'row-resize';
    const { end } = calculatePositionToTime(data);
    setSelectedTime({ startTime: selectedTime?.startTime, endTime: end });
    const resizeHeight = height + data.y;
    if (resizeRef.current) resizeRef.current.style.height = `${resizeHeight}px`;
  };

  const handleStopResize = (e, data) => {
    if (resizeHandleRef.current) resizeHandleRef.current.style.transform = 'translate(0, 0)';
    e.target.style.cursor = 'default';
    const { end } = calculatePositionToTime(data);
    handleUpdateActivity({ end });
  };

  const handleDrag = (e, data) => {
    e.preventDefault();
    const { start, end } = calculatePositionToTime(data);
    setSelectedTime({ startTime: start, endTime: end });
  };

  const handleStopDrag = async (e, data) => {
    e.preventDefault();
    const { start, end } = calculatePositionToTime(data);
    handleUpdateActivity({ start, end });
  };

  const renderLongText = (text = '') => {
    if (text.length <= textLong) return text;
    return (
      <span>
        {handleLongString(text)}{' '}
        <Tooltip
          title={text}
          placement="bottomLeft"
          getPopupContainer={(trigger) => {
            return trigger;
          }}
        >
          <span className={styles.readMoreBtn}>Read More</span>
        </Tooltip>
      </span>
    );
  };

  // MAIN AREA
  return (
    <Draggable
      axis="y"
      handle=".draggable_handle"
      cancel=".actions, .resize_handle"
      allowAnyClick={false}
      grid={[EMP_ROW_HEIGHT / 4, EMP_ROW_HEIGHT / 4]}
      bounds={{ top: boundTopDraggable, bottom: boundBottomDraggle }}
      onDrag={handleDrag}
      onStop={handleStopDrag}
    >
      <div
        ref={resizeRef}
        className={`draggable_handle ${
          height < EMP_ROW_HEIGHT / 2 ? styles.ActivityCard_hover : styles.ActivityCard
        }`}
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
        <Draggable
          axis="y"
          grid={[EMP_ROW_HEIGHT / 4, EMP_ROW_HEIGHT / 4]}
          bounds={{ top: boundTopResize, bottom: boundBottomDraggle }}
          onDrag={handleResize}
          onStop={handleStopResize}
        >
          <div ref={resizeHandleRef} className={`resize_handle ${styles.rowResize}`} />
        </Draggable>
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
            {renderLongText(taskName)}
          </Col>
          <Col span={DESCRIPTION} className={styles.normalCell}>
            {renderLongText(description)}
          </Col>
          <Col span={TIME} className={`${styles.normalCell} ${styles.blueText}`}>
            {timeInfo}
          </Col>
          <Col span={TOTAL_HOURS} className={`${styles.normalCell} ${styles.blueText}`}>
            {durationInfo}
          </Col>
          <Col span={ACTIONS} className={`actions ${styles.flexCell} ${styles.alignCenter}`}>
            <div className={styles.actionsButton}>
              <img
                src={EditIcon}
                alt=""
                onClick={(e) => {
                  e.stopPropagation();
                  setEditTaskModalVisible(true);
                }}
              />
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
    </Draggable>
  );
};

export default connect(({ user: { currentUser = {} } = {} }) => ({ currentUser }))(ActivityCard);
