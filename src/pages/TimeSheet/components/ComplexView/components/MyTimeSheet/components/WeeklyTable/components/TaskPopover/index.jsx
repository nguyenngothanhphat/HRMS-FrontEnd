import { Popover, Row, Col, Button } from 'antd';
import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import EditIcon from '@/assets/timeSheet/edit.svg';
import CloseX from '@/assets/dashboard/closeX.svg';
import DelIcon from '@/assets/timeSheet/del.svg';
import AddSolidIcon from '@/assets/timeSheet/addSolid.png';

import styles from './index.less';

const mockTasks = [
  {
    name: 'Client Meeting',
    time: '00:30:00',
  },
  {
    name: 'Feedback changes on WFs ',
    time: '02:30:00',
  },
  {
    name: 'UI Support',
    time: '03:30:00',
  },
  {
    name: 'UI Presentation to client ',
    time: '00:30:00',
  },
  {
    name: 'Client Meeting',
    time: '00:30:00',
  },
  {
    name: 'Feedback changes on WFs ',
    time: '00:30:00',
  },
  {
    name: 'UI Support',
    time: '00:30:00',
  },
];

const TaskPopover = (props) => {
  const { children } = props;
  const [showPopover, setShowPopover] = useState(false);
  const [showingTasks, setShowingTasks] = useState([]);

  const generateShowingTask = (value) => {
    if (!value) setShowingTasks(mockTasks);
    else setShowingTasks(mockTasks.slice(0, value - 1));
  };

  useEffect(() => {
    generateShowingTask(4);
  }, [JSON.stringify(mockTasks)]);

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
                  <span>{task.name}</span>
                  <div className={styles.actionBtn}>
                    <img src={EditIcon} alt="" />
                    <img src={DelIcon} alt="" />
                  </div>
                </Col>
                <Col span={6} className={styles.right}>
                  {task.time}
                </Col>
              </Row>
            );
          })}
        </div>
        {showingTasks.length !== mockTasks.length && (
          <Row className={styles.taskTable__viewMoreTask}>
            <Col span={24}>
              <div onClick={() => generateShowingTask()} className={styles.taskTable__text}>
                View +{mockTasks.length - showingTasks.length} more tasks
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
          <span>Task Details - 12 Mon September</span>
        </div>
        <div className={styles.divider} />
        {renderTaskTable()}
        <div className={styles.divider} />
        <div className={styles.addTaskBtn}>
          <Button icon={<img src={AddSolidIcon} alt="" />}>Add Task</Button>
        </div>
      </div>
    );
  };

  return (
    <Popover
      placement="top"
      content={() => renderPopup()}
      title={null}
      trigger="click"
      visible={showPopover}
      overlayClassName={styles.TaskPopover}
      onVisibleChange={() => setShowPopover(!showPopover)}
    >
      {children}
    </Popover>
  );
};

export default connect(() => ({}))(TaskPopover);
