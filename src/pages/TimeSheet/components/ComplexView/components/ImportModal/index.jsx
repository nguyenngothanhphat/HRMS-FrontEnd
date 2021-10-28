import { Button, Modal } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import DateSwitcher from './components/DateSwitcher';
import TaskTable from './components/TaskTable';
import styles from './index.less';

const dateFormat = 'MM/DD/YYYY';

const ImportModal = (props) => {
  const { visible = false, title = 'Import rows from yesterday', onClose = () => {} } = props;
  // const { dispatch } = props;
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedDate, setSelectedDate] = useState(moment());

  // FUNCTIONS
  // get dates between two dates
  const enumerateDaysBetweenDates = (startDate1, endDate1) => {
    if (startDate1 && endDate1) {
      const now = startDate1.clone();
      const dates = [];

      while (now.isSameOrBefore(endDate1)) {
        dates.push(now.format(dateFormat));
        now.add(1, 'days');
      }
      return dates;
    }
    return [];
  };

  const onPrevWeekClick = () => {
    const lastSunday = moment(startDate).add(-1, 'weeks');
    const currentSaturday = moment(endDate).add(-1, 'weeks');
    setStartDate(lastSunday);
    setEndDate(currentSaturday);
  };

  const onNextWeekClick = () => {
    const currentSunday = moment(startDate).add(1, 'weeks');
    const nextSaturday = moment(startDate).add(1, 'weeks').weekday(6);
    setStartDate(currentSunday);
    setEndDate(nextSaturday);
  };

  useEffect(() => {
    const lastSunday = moment().add(-1, 'weeks').weekday(7);
    const currentSaturday = moment().weekday(6);
    setStartDate(lastSunday);
    setEndDate(currentSaturday);
    return () => {};
  }, []);

  // RENDER UI
  const renderModalHeader = () => {
    return (
      <div className={styles.header}>
        <span className={styles.header__text}>{title}</span>
        <span className={styles.header__date}>
          {moment(selectedDate).locale('en').format('MMMM DD, YYYY')}
        </span>
      </div>
    );
  };

  const handleCancel = () => {
    onClose();
  };

  const handleFinish = () => {
    // finish
  };

  const renderModalContent = () => {
    const dates = enumerateDaysBetweenDates(startDate, endDate) || [];
    const mockProject = [
      {
        id: 1,
        project: 'HRMS',
        task: 'Brainstorming',
        description: 'Concepts & understanding of the flows',
      },
      {
        id: 2,
        project: 'HRMS',
        task: 'Brainstorming',
        description: 'Concepts & understanding of the flows',
      },
      {
        id: 3,
        project: 'HRMS',
        task: 'Brainstorming',
        description: 'Concepts & understanding of the flows',
      },
    ];
    return (
      <div className={styles.content}>
        <DateSwitcher
          dates={dates}
          onPrevWeekClick={onPrevWeekClick}
          onNextWeekClick={onNextWeekClick}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
        <TaskTable list={[]} selectedDate={selectedDate} />
      </div>
    );
  };

  return (
    <>
      <Modal
        className={`${styles.ImportModal} ${styles.noPadding}`}
        onCancel={handleCancel}
        destroyOnClose
        width={700}
        footer={
          <>
            <div className={styles.taskNumberCount}>
              <span className={styles.descText}>Tasks Selected:</span>
              <span className={styles.number}>05</span>
            </div>
            <div className={styles.mainButtons}>
              <Button className={styles.btnCancel} onClick={handleCancel}>
                Cancel
              </Button>
              <Button className={styles.btnSubmit} type="primary" onClick={handleFinish}>
                Import
              </Button>
            </div>
          </>
        }
        title={renderModalHeader()}
        centered
        visible={visible}
      >
        {renderModalContent()}
      </Modal>
    </>
  );
};

export default connect(() => ({}))(ImportModal);
