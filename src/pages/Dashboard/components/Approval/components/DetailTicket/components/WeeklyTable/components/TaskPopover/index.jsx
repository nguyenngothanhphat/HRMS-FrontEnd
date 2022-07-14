import { Col, Popover, Row } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { convertMsToTime } from '@/utils/timeSheet';
import CloseX from '@/assets/dashboard/closeX.svg';
import styles from './index.less';

const TaskPopover = (props) => {
  const { children, dispatch, tasks = [], date = '', projectName = '', placement = 'top' } = props;
  const [showPopover, setShowPopover] = useState(false);
  const [showingTasks, setShowingTasks] = useState([]);

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
    </>
  );
};

export default connect(({ user: { currentUser: { employee = {} } = {} } }) => ({ employee }))(
  TaskPopover,
);
