// this component is used for creating a new timeoff request
// and for editing (updating) a exist one

import { Affix, Col, Row, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
import { TIMEOFF_LINK_ACTION, TIMEOFF_STATUS } from '@/utils/timeOff';
import RequestInformation from './components/RequestInformation';
import NoteComponent from '@/components/NoteComponent';
import Icon1 from '@/assets/timeOff/icon1.svg';
import styles from './index.less';

const { IN_PROGRESS, ACCEPTED, ON_HOLD, REJECTED, DRAFTS, WITHDRAWN } = TIMEOFF_STATUS;
const { EDIT_LEAVE_REQUEST, NEW_LEAVE_REQUEST } = TIMEOFF_LINK_ACTION;

const LeaveRequestForm = (props) => {
  const {
    dispatch,
    timeOff: {
      viewingLeaveRequest = {},
      viewingLeaveRequest: { status = '', ticketID = '' } = {},
      yourTimeOffTypes = {},
    } = {},
    match: { params: { action = '', reId = '' } = {} },
    user: { currentUser: { employee = {} } = {} } = {},
    loadingFetchLeaveRequestById,
  } = props;

  const [invalidDates, setInvalidDates] = useState([]);

  const fetchTimeOffTypes = () => {
    if (employee?._id) {
      dispatch({
        type: 'timeOff/fetchTimeOffTypeByEmployeeEffect',
        payload: {
          employee: employee._id,
        },
      });
    }
  };

  const getColorOfStatus = () => {
    switch (status) {
      case IN_PROGRESS:
        return `${styles.leaveStatus} ${styles.inProgressColor}`;
      case ACCEPTED:
        return `${styles.leaveStatus} ${styles.approvedColor}`;
      case REJECTED:
        return `${styles.leaveStatus} ${styles.rejectedColor}`;
      case DRAFTS:
        return `${styles.leaveStatus} ${styles.draftsColor}`;
      case ON_HOLD:
        return `${styles.leaveStatus} ${styles.onHoldColor}`;
      case WITHDRAWN:
        return `${styles.leaveStatus} ${styles.withdrawnColor}`;
      default:
        return `${styles.leaveStatus}`;
    }
  };

  const getNameOfStatus = () => {
    switch (status) {
      case IN_PROGRESS:
        return 'In Progress';
      case ACCEPTED:
        return 'Approved';
      case REJECTED:
        return 'Rejected';
      case DRAFTS:
        return 'Drafts';
      case ON_HOLD:
        return 'On Hold';
      case WITHDRAWN:
        return 'Withdrawn';
      default:
        return 'Unknown';
    }
  };

  useEffect(() => {
    if (Object.keys(yourTimeOffTypes).length === 0) {
      fetchTimeOffTypes();
    }

    if (action === EDIT_LEAVE_REQUEST) {
      dispatch({
        type: 'timeOff/fetchLeaveRequestById',
        id: reId,
      });
    }

    dispatch({
      type: 'timeOff/fetchLeaveRequestOfEmployee',
      payload: {
        status: [IN_PROGRESS, ACCEPTED],
      },
    }).then((res) => {
      if (res.statusCode === 200) {
        let invalidDatesTemp = [...invalidDates];
        const { items: leaveRequests = [] } = res?.data;
        leaveRequests.forEach((x) => {
          const temp = x.leaveDates.map((y) => {
            return {
              date: y.date,
              timeOfDay: y.timeOfDay,
            };
          });
          invalidDatesTemp = [...invalidDatesTemp, ...temp];
        });

        setInvalidDates(invalidDatesTemp);
      }
    });

    window.scroll({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  const Note = {
    title: 'Note',
    icon: Icon1,
    borderColor: '#ebeff2',
    data: (
      <Typography.Text>
        Timeoff requests requires approvals.
        <br />
        It takes anywhere around 2-4 standard working days for the entire process to complete.
      </Typography.Text>
    ),
  };

  return (
    <PageContainer>
      <div className={styles.leaveRequest}>
        <Affix offsetTop={42}>
          <div className={styles.titlePage}>
            {action === NEW_LEAVE_REQUEST && (
              <>
                <p className={styles.titlePage__text}>Apply for Timeoff</p>
              </>
            )}
            {action === EDIT_LEAVE_REQUEST && (
              <>
                <p className={styles.titlePage__text}>[Ticket ID: {ticketID}]</p>

                <div className={getColorOfStatus()}>
                  <span className={styles.dot} />
                  <span className={styles.statusText}>{getNameOfStatus()}</span>
                </div>
              </>
            )}
          </div>
        </Affix>
        {!loadingFetchLeaveRequestById &&
          action === EDIT_LEAVE_REQUEST &&
          status !== DRAFTS &&
          status !== IN_PROGRESS && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '100px 0',
              }}
            >
              <span>You are not allowed to edit this leave request!</span>
            </div>
          )}

        {(action === NEW_LEAVE_REQUEST ||
          (action === EDIT_LEAVE_REQUEST &&
            !loadingFetchLeaveRequestById &&
            (status === DRAFTS || status === IN_PROGRESS))) && (
          <>
            <Row className={styles.container} gutter={[20, 20]}>
              <Col xs={24} xl={18}>
                <RequestInformation
                  action={action}
                  status={status}
                  ticketID={ticketID}
                  invalidDates={invalidDates}
                  viewingLeaveRequest={viewingLeaveRequest}
                />
              </Col>
              <Col xs={24} xl={6}>
                <NoteComponent note={Note} />
              </Col>
            </Row>
          </>
        )}
      </div>
    </PageContainer>
  );
};

export default connect(({ timeOff, loading, user }) => ({
  timeOff,
  user,
  loadingFetchLeaveRequestById: loading.effects['timeOff/fetchLeaveRequestById'],
}))(LeaveRequestForm);
