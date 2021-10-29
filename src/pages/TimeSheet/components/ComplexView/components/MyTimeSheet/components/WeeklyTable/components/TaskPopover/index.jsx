import { Button, Col, Popover, Row } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import CloseX from '@/assets/dashboard/closeX.svg';
import AddSolidIcon from '@/assets/timeSheet/addSolid.png';
import DelIcon from '@/assets/timeSheet/del.svg';
import EditIcon from '@/assets/timeSheet/edit.svg';
import ModalImage from '@/assets/timeSheet/modalImage1.png';
import ActionModal from '@/pages/TimeSheet/components/ActionModal';
import AddTaskModal from '@/pages/TimeSheet/components/ComplexView/components/AddTaskModal';
import { getCurrentCompany } from '@/utils/authority';
import { convertMsToTime } from '@/utils/timeSheet';

import styles from './index.less';

const TaskPopover = (props) => {
  const { children, dispatch, tasks = [], date = '', projectName = '', placement = 'top' } = props;
  const [showPopover, setShowPopover] = useState(false);
  const [showingTasks, setShowingTasks] = useState([]);
  const [addTaskModalVisible, setAddTaskModalVisible] = useState(false);
  const [removeModalVisibe, setRemoveModalVisibe] = useState(false);
  const [removingPackage, setRemovingPackage] = useState({});
  const { employee: { _id: employeeId = '' } = {} } = props;

  const generateShowingTask = (value) => {
    if (!value) setShowingTasks(tasks);
    else setShowingTasks(tasks.slice(0, value - 1));
  };

  const refreshData = () => {
    dispatch({
      type: 'timeSheet/fetchMyTimesheetByTypeEffect',
      isRefreshing: true,
    });
  };

  const onRemoveCard = async () => {
    const { id } = removingPackage;
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
            return (
              <Row className={styles.eachRow} justify="space-between" align="middle">
                <Col span={18} className={styles.taskName}>
                  <span>{task.taskName || 'No name'}</span>
                  <div className={styles.actionBtn}>
                    <img src={EditIcon} alt="" />
                    <img
                      src={DelIcon}
                      alt=""
                      onClick={() => {
                        setRemovingPackage(task);
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
        {showingTasks.length !== tasks.length && (
          <Row className={styles.taskTable__viewMoreTask}>
            <Col span={24}>
              <div onClick={() => generateShowingTask()} className={styles.taskTable__text}>
                View +{tasks.length - showingTasks.length} more tasks
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
            {projectName} - {removingPackage?.taskName}
          </span>
          ?
        </span>
      </ActionModal>
    </>
  );
};

export default connect(({ user: { currentUser: { employee = {} } = {} } }) => ({ employee }))(
  TaskPopover,
);
