import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { TIMEOFF_STATUS } from '@/utils/timeOff';
import FilterBar from '../FilterBar';
import MyCompoffTable from '../MyCompoffTable';
import MyLeaveTable from '../MyLeaveTable';
import styles from './index.less';

const { IN_PROGRESS, IN_PROGRESS_NEXT, ACCEPTED, ON_HOLD, REJECTED, DRAFTS, WITHDRAWN } =
  TIMEOFF_STATUS;

const TimeOffRequestTab = (props) => {
  const {
    timeOff: {
      currentFilterTab,
      filter: { search, fromDate, toDate, type: timeOffTypes },
      paging: { page, limit },
      compoffRequests = [],
      leaveRequests = [],
    } = {},
    type = 0,
    tab = 0,
    dispatch,
  } = props;

  const [inProgressLength, setInProgressLength] = useState(0);
  const [approvedLength, setApprovedLength] = useState(0);
  const [rejectedLength, setRejectedLength] = useState(0);
  const [draftLength, setDraftLength] = useState(0);
  const [withdrawnLength, setWithdrawnLength] = useState(0);
  const [selectedTabNumber, setSelectedTabNumber] = useState('1');

  const setSelectedFilterTab = (id) => {
    dispatch({
      type: 'timeOff/save',
      payload: {
        currentFilterTab: String(id),
      },
    });
  };

  useEffect(() => {
    setSelectedTabNumber(currentFilterTab);
  }, [currentFilterTab]);

  const countTotal = (newData) => {
    let inProgressLengthTemp = 0;
    let approvedLengthTemp = 0;
    let rejectedLengthTemp = 0;
    let draftLengthTemp = 0;
    let withdrawnLengthTemp = 0;

    newData.forEach((item) => {
      const { _id: status = '' } = item;
      switch (status) {
        case IN_PROGRESS:
        case ON_HOLD: {
          inProgressLengthTemp += item.count;
          break;
        }
        case ACCEPTED: {
          approvedLengthTemp += item.count;
          break;
        }
        case REJECTED: {
          rejectedLengthTemp += item.count;
          break;
        }
        case DRAFTS: {
          draftLengthTemp += item.count;
          break;
        }
        case WITHDRAWN: {
          withdrawnLengthTemp += item.count;
          break;
        }
        default:
          break;
      }
    });
    setInProgressLength(inProgressLengthTemp);
    setApprovedLength(approvedLengthTemp);
    setRejectedLength(rejectedLengthTemp);
    setDraftLength(draftLengthTemp);
    setWithdrawnLength(withdrawnLengthTemp);
  };

  const fetchData = () => {
    let status = '';

    if (type === 1) {
      if (selectedTabNumber === '1') {
        status = [IN_PROGRESS, ON_HOLD];
      }
      if (selectedTabNumber === '2') {
        status = [ACCEPTED];
      }
      if (selectedTabNumber === '3') {
        status = [REJECTED];
      }
      if (selectedTabNumber === '4') {
        status = [DRAFTS];
      }
      if (selectedTabNumber === '5') {
        status = [WITHDRAWN];
      }
    } else if (type === 2) {
      // compoff
      if (selectedTabNumber === '1') {
        status = [IN_PROGRESS_NEXT, IN_PROGRESS];
      }
      if (selectedTabNumber === '2') {
        status = [ACCEPTED];
      }
      if (selectedTabNumber === '3') {
        status = [REJECTED];
      }
      if (selectedTabNumber === '4') {
        status = [DRAFTS];
      }
      if (selectedTabNumber === '5') {
        status = [ON_HOLD];
      }
    }

    let typeAPI = '';
    if (type === 1) {
      typeAPI = 'timeOff/fetchLeaveRequestOfEmployee';
    } else typeAPI = 'timeOff/fetchMyCompoffRequests';

    dispatch({
      type: typeAPI,
      payload: {
        status,
        type: timeOffTypes,
        search,
        fromDate,
        toDate,
        page,
        limit,
      },
    }).then((res) => {
      const { data: { total = [] } = {}, statusCode } = res;
      if (statusCode === 200) {
        countTotal(total);
      }
    });
  };

  useEffect(() => {
    if (timeOffTypes.length > 0) {
      fetchData();
    }
  }, [selectedTabNumber, page, search, fromDate, toDate, JSON.stringify(timeOffTypes)]);

  const dataNumber = {
    inProgressLength,
    approvedLength,
    rejectedLength,
    draftLength,
    withdrawnLength,
  };

  return (
    <div className={styles.TimeOffRequestTab}>
      <FilterBar dataNumber={dataNumber} setSelectedFilterTab={setSelectedFilterTab} />
      <div className={styles.tableContainer}>
        {type === 1 && (
          <>
            <MyLeaveTable data={leaveRequests} tab={tab} />
          </>
        )}
        {type === 2 && (
          <>
            <MyCompoffTable data={compoffRequests} tab={tab} />
          </>
        )}
      </div>
    </div>
  );
};
export default connect(({ timeOff, loading, user }) => ({
  timeOff,
  user,
  loading1: loading.effects['timeOff/fetchLeaveRequestOfEmployee'],
  loading2: loading.effects['timeOff/fetchTeamLeaveRequests'],
  loading3: loading.effects['timeOff/fetchMyCompoffRequests'],
  loading4: loading.effects['timeOff/fetchTeamCompoffRequests'],
}))(TimeOffRequestTab);
