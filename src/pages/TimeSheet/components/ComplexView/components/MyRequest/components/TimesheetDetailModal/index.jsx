import { Button, Divider, Modal } from 'antd';
import moment from 'moment';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { connect } from 'umi';
import { dateFormatAPI } from '@/utils/timeSheet';
import { getCurrentCompany } from '@/utils/authority';
import WeeklyTable from './components/WeeklyTable';
import styles from './index.less';

const TimesheetDetailModal = (props) => {
  const {
    visible = false,
    title = 'Timesheet Details',
    onClose = () => {},
    projectId = '',
    dataSource = [],
    dispatch,
    myTimesheetByWeek = [],
    timeoffList = [],
    employee: { _id: employeeId = '' } = {},
    rowKey = 0,
    currentDateProp = '',
    temp = [],
  } = props;
  const {
    status = '',
    dateRange: { startDate: startDateWeek = '', endDate: endDateWeek = '' } = {},
    comments = '',
  } = dataSource[rowKey] || {};

  const {
    user: {
      currentUser: {
        location: { headQuarterAddress: { country: { _id: countryID } = {} } = {} } = {},
      } = {},
    } = {},
  } = props;
  const [selectedDate, setSelectedDate] = useState(moment());
  // const [startDateWeek, setStartDateWeek] = useState('2022-06-06');
  // const [endDateWeek, setEndDateWeek] = useState('2022-06-12');
  const [selectedView, setSelectedView] = useState('W');
  const [isEdited, setIsEdited] = useState(false);

  const fetchMyTimesheetEffectByType = (startDate, endDate) => {
    dispatch({
      type: 'timeSheet/fetchMyTimesheetByTypeEffect',
      payload: {
        companyId: getCurrentCompany(),
        employeeId,
        fromDate: moment(startDate).format(dateFormatAPI),
        toDate: moment(endDate).format(dateFormatAPI),
        viewType: selectedView,
      },
    });
  };

  useLayoutEffect(() => {
    setIsEdited(true);
  }, [myTimesheetByWeek]);

  useLayoutEffect(() => {
    if (startDateWeek && selectedView === 'W') {
      fetchMyTimesheetEffectByType(startDateWeek, endDateWeek);
    }
  }, [startDateWeek, selectedView]);

  useEffect(() => {
    if (moment(currentDateProp).isValid() === true) {
      setSelectedDate(moment(currentDateProp));
    }
  }, [currentDateProp]);

  const handleCancel = () => {
    onClose();
  };
  // RENDER UI
  const renderModalHeader = () => {
    return (
      <div className={styles.header}>
        <span
          className={
            status === 'pending'
              ? styles.status__Pending
              : status === 'approved'
              ? styles.status__Approved
              : styles.status__Rejected
          }
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
        <span className={styles.header__text}>{title}</span>
      </div>
    );
  };

  const renderModalContent = () => {
    return (
      <>
        <div className={styles.content}>
          <WeeklyTable
            startDate={startDateWeek}
            endDate={endDateWeek}
            data={myTimesheetByWeek}
            timeoffList={timeoffList}
            setSelectedDate={setSelectedDate}
            setSelectedView={setSelectedView}
            setIsEdited={() => setIsEdited(true)}
          />
          {comments && (
            <>
              <Divider />
              <div>
                Manager&apos;s Comment
                <div className={styles.content__comments}>{comments}</div>
              </div>
            </>
          )}
        </div>
      </>
    );
  };
  console.log(isEdited);

  const disabledBtn = () => {
    // if (!data?.projectDetail) return true;
    // if (Array.isArray(data?.projectDetail)) {
    //   if (data?.projectDetail.length === 0) {
    //     return true;
    //   }
    // }

    return false;
  };

  const renderModalFooter = () => {
    return (
      <>
        <Button className={styles.btnCancel}>Cancel</Button>
        <Button
          disabled={disabledBtn()}
          className={styles.btnSubmit}
          type="primary"
          onClick={() => {
            onClose();
          }}
        >
          Re-Submit
        </Button>
      </>
    );
  };

  return (
    <>
      <Modal
        className={`${styles.TimesheetDetailModal} ${styles.noPadding}`}
        onCancel={handleCancel}
        destroyOnClose
        width={750}
        footer={isEdited ? renderModalFooter() : <div />}
        title={renderModalHeader()}
        centered
        visible={visible}
      >
        {renderModalContent()}
      </Modal>
    </>
  );
};

export default connect(
  ({
    user: { currentUser: { employee = {} } = {} },
    timeSheet: { myTimesheetByWeek = [], timeoffList = [] },
  }) => ({ employee, myTimesheetByWeek, timeoffList }),
)(TimesheetDetailModal);
