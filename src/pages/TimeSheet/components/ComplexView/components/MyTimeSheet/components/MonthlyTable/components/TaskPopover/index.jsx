import { Button, Col, Popover, Row } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { connect } from 'umi';
import AddSolidIcon from '@/assets/timeSheet/addSolid.png';
import CalendarIcon from '@/assets/timeSheet/calendar.svg';
import DelIcon from '@/assets/timeSheet/del.svg';
import EditIcon from '@/assets/timeSheet/edit.svg';
import AddTaskModal from '@/pages/TimeSheet/components/ComplexView/components/AddTaskModal';
import { convertMsToTime } from '@/utils/timeSheet';
import styles from './index.less';

const TaskPopover = (props) => {
  const { children, tasks = [], startDate = '', endDate = '', placement = 'top' } = props;
  const [showPopover, setShowPopover] = useState(false);
  const [addTaskModalVisible, setAddTaskModalVisible] = useState(false);

  const renderTaskTable = () => {
    return (
      <div className={styles.taskTable}>
        <div className={styles.taskTable__body}>
          {tasks.length === 0 && (
            <Row className={styles.eachRow} justify="space-between" align="middle">
              <Col span={24} className={styles.taskName}>
                <span>No tasks</span>
              </Col>
            </Row>
          )}
          {tasks.map((task) => {
            const { date = '', dailyTotalTime } = task;
            const momentDate = moment(date).locale('en');
            return (
              <Row className={styles.eachRow} justify="space-between" align="middle">
                <Col span={18} className={styles.dateName}>
                  <div className={styles.icon}>
                    <span>
                      {momentDate ? moment(momentDate).format('dddd').toString()?.charAt(0) : 'P'}
                    </span>
                  </div>
                  <div>
                    <span className={styles.name}>{moment(momentDate).format('dddd')}</span>
                    <span className={styles.timeBlock}>
                      <span className={styles.date}>{moment(momentDate).format('MMM DD')}</span>{' '}
                      <img className={styles.calendarIcon} src={CalendarIcon} alt="" />
                      <span className={styles.time}>{convertMsToTime(dailyTotalTime || 0)}</span>
                    </span>
                  </div>
                </Col>
                <Col span={6} className={styles.right}>
                  <div className={styles.actionBtn}>
                    <img src={EditIcon} alt="" />
                    <img src={DelIcon} alt="" />
                  </div>
                </Col>
              </Row>
            );
          })}
        </div>
      </div>
    );
  };

  const renderPopup = () => {
    return (
      <div className={styles.popupContainer}>
        <div className={styles.header}>
          <span className={styles.left}>
            <span className={styles.boldText}>Task Details</span> -{' '}
            {moment(startDate).locale('en').format('MMM DD')} -{' '}
            {moment(endDate).locale('en').format('MMM DD')}
          </span>
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
      />
    </>
  );
};

export default connect(({ user: { currentUser: { employee = {} } = {} } }) => ({ employee }))(
  TaskPopover,
);
