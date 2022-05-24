import { Avatar, Col, Popover, Row, Tooltip } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import CloseX from '@/assets/dashboard/closeX.svg';

import { convertMsToTime } from '@/utils/timeSheet';
import styles from './index.less';

const TaskPopover = (props) => {
  const { children, tasks = [], startDate = '', endDate = '', placement = 'top' } = props;
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
          <Col span={12}>Task</Col>
          <Col span={6}>Date</Col>
          <Col span={6} className={styles.right}>
            Time Duration
          </Col>
        </Row>
        <div className={styles.taskTable__body}>
          {showingTasks?.length === 0 && (
            <Row className={styles.eachRow} justify="space-between" align="middle">
              <Col span={24} className={styles.taskName}>
                <span>No tasks</span>
              </Col>
            </Row>
          )}
          {showingTasks?.map((task) => {
            return (
              <Row className={styles.eachRow} justify="space-between" align="middle">
                <Col span={12} className={styles.taskName}>
                  <span>{task.taskName || 'No name'}</span>
                </Col>
                <Col span={6} className={styles.resources}>
                  {moment(startDate).locale('en').format('MMM DD, YYYY')}
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
          <span className={styles.left}>
            Task Details - {moment(startDate).locale('en').format('MMM DD, YYYY')} -{' '}
            {moment(endDate).locale('en').format('MMM DD, YYYY')}
          </span>
        </div>
        <div className={styles.divider} />
        {renderTaskTable()}
      </div>
    );
  };

  return (
    <>
      <Popover
        placement={placement}
        content={() => renderPopup()}
        title={null}
        trigger="hover"
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
