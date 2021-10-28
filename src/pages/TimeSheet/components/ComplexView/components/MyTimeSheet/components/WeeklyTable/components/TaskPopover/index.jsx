import { Popover, Row, Col, Button } from 'antd';
import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import EditIcon from '@/assets/timeSheet/edit.svg';
import CloseX from '@/assets/dashboard/closeX.svg';
import DelIcon from '@/assets/timeSheet/del.svg';
import AddSolidIcon from '@/assets/timeSheet/addSolid.png';
import AddTaskModal from '@/pages/TimeSheet/components/ComplexView/components/AddTaskModal';

import styles from './index.less';

const TaskPopover = (props) => {
  const { children, tasks = [], date = '', projectName = '' } = props;
  const [showPopover, setShowPopover] = useState(false);
  const [showingTasks, setShowingTasks] = useState([]);
  const [addTaskModalVisible, setAddTaskModalVisible] = useState(false);

  const generateShowingTask = (value) => {
    if (!value) setShowingTasks(tasks);
    else setShowingTasks(tasks.slice(0, value - 1));
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
          {showingTasks.map((task) => {
            return (
              <Row className={styles.eachRow} justify="space-between" align="middle">
                <Col span={18} className={styles.taskName}>
                  <span>{task.taskName || 'No name'}</span>
                  <div className={styles.actionBtn}>
                    <img src={EditIcon} alt="" />
                    <img src={DelIcon} alt="" />
                  </div>
                </Col>
                <Col span={6} className={styles.right}>
                  {task.totalHours}
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
        placement="top"
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
    </>
  );
};

export default connect(() => ({}))(TaskPopover);
