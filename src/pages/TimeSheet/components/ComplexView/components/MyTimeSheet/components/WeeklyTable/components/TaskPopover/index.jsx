import { Button, Col, Popover, Row } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect, Link } from 'umi';
import CloseX from '@/assets/dashboard/closeX.svg';
import AddSolidIcon from '@/assets/timeSheet/addSolid.png';
import DelIcon from '@/assets/timeSheet/del.svg';
import EditIcon from '@/assets/timeSheet/edit.svg';
import ModalImage from '@/assets/timeSheet/modalImage1.png';
import CommonModal from '@/components/CommonModal';
import AddTaskModal from '@/pages/TimeSheet/components/ComplexView/components/AddTaskModal';
import EditTaskModal from '@/pages/TimeSheet/components/ComplexView/components/EditTaskModal';
import { getCurrentCompany } from '@/utils/authority';
import { convertMsToTime } from '@/utils/timeSheet';
import styles from './index.less';
import { TIMEOFF_PERIOD } from '@/utils/timeOff';

const TaskPopover = (props) => {
  const {
    children,
    dispatch,
    tasks = [],
    timeoff = [],
    date = '',
    projectName = '',
    placement = 'top',
    timeSheet: { employeeSchedule: { totalHour = 0 } = {} } = {},
  } = props;
  const [showPopover, setShowPopover] = useState(false);
  const [showingTasks, setShowingTasks] = useState([]);

  // modals
  const [addTaskModalVisible, setAddTaskModalVisible] = useState(false);
  const [editTaskModalVisible, setEditTaskModalVisible] = useState(false);
  const [removeModalVisibe, setRemoveModalVisibe] = useState(false);
  const [handlingPackage, setHandlingPackage] = useState({});

  const { employee: { _id: employeeId = '' } = {} } = props;

  const generateShowingTask = (value) => {
    const result = [...timeoff, ...tasks];
    if (!value) setShowingTasks(result);
    else setShowingTasks(result.slice(0, value - 1));
  };

  const refreshData = () => {
    dispatch({
      type: 'timeSheet/fetchMyTimesheetByTypeEffect',
      isRefreshing: true,
    });
  };

  const onRemoveCard = async () => {
    const { id } = handlingPackage;
    const res = await dispatch({
      type: 'timeSheet/removeActivityEffect',
      payload: {
        id,
        employeeId,
        companyId: getCurrentCompany(),
      },
    });
    if (res.code === 200) {
      setRemoveModalVisibe(false);
      refreshData();
    }
  };

  const getTimeOffTotalHours = (item) => {
    const { startTime = '', endTime = '', timeOfDay = '' } = item;

    if (timeOfDay === TIMEOFF_PERIOD.WHOLE_DAY) {
      return totalHour;
    }
    if (timeOfDay === TIMEOFF_PERIOD.MORNING || timeOfDay === TIMEOFF_PERIOD.AFTERNOON) {
      return totalHour / 2;
    }

    return moment.duration(moment(endTime, 'HH:mm').diff(moment(startTime, 'HH:mm'))).asHours();
  };

  useEffect(() => {
    generateShowingTask(4);
  }, [JSON.stringify(tasks)]);

  const renderTaskTable = () => {
    return (
      <div className={styles.taskTable}>
        <Row className={styles.taskTable__header} justify="space-between">
          <Col span={18}>Task</Col>
          <Col span={6} className={styles.right}>
            Time Duration
          </Col>
        </Row>
        <div className={styles.taskTable__body}>
          {showingTasks.length === 0 && (
            <Row className={styles.eachRow} justify="space-between" align="middle">
              <Col span={24} className={styles.taskName}>
                <span>No tasks</span>
              </Col>
            </Row>
          )}
          {showingTasks.map((task) => {
            if (task.startTime && task.endTime) {
              return (
                <Row className={styles.eachRow} justify="space-between" align="middle">
                  <Col span={18} className={styles.taskName}>
                    <span>
                      Timeoff (
                      <Link to={`/time-off/overview/personal-timeoff/view/${task.leaveId}`}>
                        {task.id}
                      </Link>
                      )
                    </span>
                  </Col>
                  <Col span={6} className={styles.right}>
                    {convertMsToTime(getTimeOffTotalHours(task) * 3600000)}
                  </Col>
                </Row>
              );
            }
            return (
              <Row className={styles.eachRow} justify="space-between" align="middle">
                <Col span={18} className={styles.taskName}>
                  <span>{task.taskName || 'No name'}</span>
                  <div className={styles.actionBtn}>
                    <img
                      src={EditIcon}
                      alt=""
                      onClick={() => {
                        setHandlingPackage(task);
                        setShowPopover(false);
                        setEditTaskModalVisible(true);
                      }}
                    />
                    <img
                      src={DelIcon}
                      alt=""
                      onClick={() => {
                        setHandlingPackage(task);
                        setShowPopover(false);
                        setRemoveModalVisibe(true);
                      }}
                    />
                  </div>
                </Col>
                <Col span={6} className={styles.right}>
                  {convertMsToTime(task.duration)}
                </Col>
              </Row>
            );
          })}
        </div>
        {showingTasks.length !== tasks.length + timeoff.length && (
          <Row className={styles.taskTable__viewMoreTask}>
            <Col span={24}>
              <div onClick={() => generateShowingTask()} className={styles.taskTable__text}>
                View +{tasks.length + timeoff.length - showingTasks.length} more tasks
              </div>
            </Col>
          </Row>
        )}
      </div>
    );
  };

  const renderPopup = () => {
    return (
      <div className={styles.popupContainer}>
        <img
          className={styles.closeButton}
          src={CloseX}
          alt=""
          onClick={() => setShowPopover(!showPopover)}
        />
        <div className={styles.header}>
          <span>Task Details - {moment(date).locale('en').format('DD ddd MMMM')}</span>
        </div>
        <div className={styles.divider} />
        {renderTaskTable()}
        <div className={styles.divider} />
        <div className={styles.addTaskBtn}>
          <Button
            onClick={() => {
              setAddTaskModalVisible(true);
              setShowPopover(false);
            }}
            icon={<img src={AddSolidIcon} alt="" />}
          >
            Add Task
          </Button>
        </div>
      </div>
    );
  };

  return (
    <>
      <Popover
        placement={placement}
        content={() => renderPopup()}
        title={null}
        trigger="click"
        visible={showPopover}
        overlayClassName={styles.TaskPopover}
        onVisibleChange={() => {
          setShowPopover(!showPopover);
        }}
      >
        {children}
      </Popover>
      <AddTaskModal
        visible={addTaskModalVisible}
        onClose={() => setAddTaskModalVisible(false)}
        mode="multiple"
        date={date}
        projectName={projectName}
      />
      <EditTaskModal
        visible={editTaskModalVisible}
        onClose={() => setEditTaskModalVisible(false)}
        date={date}
        task={handlingPackage}
      />

      <CommonModal
        visible={removeModalVisibe}
        onClose={() => setRemoveModalVisibe(false)}
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
                {handlingPackage?.projectName} - {handlingPackage?.taskName}
              </span>
              ?
            </span>
          </div>
        }
      />
    </>
  );
};

export default connect(({ timeSheet, user: { currentUser: { employee = {} } = {} } }) => ({
  employee,
  timeSheet,
}))(TaskPopover);
