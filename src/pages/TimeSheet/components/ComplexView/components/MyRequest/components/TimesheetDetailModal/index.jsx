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
    dataSource = [],
    dispatch,
    myTimesheetByWeek = [],
    timeoffList = [],
    employee: { _id: employeeId = '' } = {},
    rowKey = 0,
    currentDateProp = '',
    user: {
      currentUser: {
        location: { headQuarterAddress: { country: { _id: countryID } = {} } = {} } = {},
      } = {},
    } = {},
  } = props;
  const {
    status = '',
    fromDate: startDateWeek = '',
    toDate: endDateWeek = '',
    comment = '',
    ticketId = '',
  } = dataSource[rowKey] || {};
  const [selectedDate, setSelectedDate] = useState(moment());
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
  const handelResubmit = async () => {
    await dispatch({
      type: 'timeSheet/resubmitMyRequest',
      payload: {
        ticketId,
      },
    });
    onClose();
  };

  // RENDER UI
  const renderModalHeader = () => {
    return (
      <div className={styles.header}>
        <span
          className={
            // eslint-disable-next-line no-nested-ternary
            status.toLowerCase() === 'pending'
              ? styles.status__Pending
              : status.toLowerCase() === 'approved'
              ? styles.status__Approved
              : styles.status__Rejected
          }
        >
          {status.charAt(0) + status.slice(1).toLowerCase()}
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
            callback={(value) => {
              setIsEdited(value);
            }}
          />
          {comment && (
            <>
              <Divider />
              <div>
                Manager&apos;s Comment
                <div className={styles.content__comments}>{comment}</div>
              </div>
            </>
          )}
        </div>
      </>
    );
  };

  const renderModalFooter = () => {
    return (
      <>
        <Button className={styles.btnCancel} onClick={handleCancel}>
          Cancel
        </Button>
        <Button className={styles.btnSubmit} type="primary" onClick={handelResubmit}>
          Re-Submit
        </Button>
      </>
    );
  };

  return (
    <>
      <Modal
        className={`${styles.TimesheetDetailModal} ${styles.noPadding}`}
        onCancel={isEdited ? handelResubmit : handleCancel}
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
