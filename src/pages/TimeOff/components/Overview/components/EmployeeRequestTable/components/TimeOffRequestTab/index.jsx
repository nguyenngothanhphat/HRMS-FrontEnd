import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { TIMEOFF_DATE_FORMAT_API, LEAVE_QUERY_TYPE, TIMEOFF_STATUS } from '@/constants/timeOff';
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
      filter: { search, fromDate, toDate, type: timeOffTypes = [] },
      filter = {},
      paging: { page, limit },
      compoffRequests = [],
      allLeaveRequests = [],
      currentPayloadTypes = [],
      totalByStatus = {},
    } = {},
    type = 0,
    tab = 0,
    dispatch,
  } = props;

  const [selectedTabNumber, setSelectedTabNumber] = useState('1');

  const setSelectedFilterTab = (id) => {
    dispatch({
      type: 'timeOff/save',
      payload: {
        currentFilterTab: String(id),
      },
    });
  };

  const getTotalByStatus = () => {
    dispatch({
      type: 'timeOff/getTotalByStatusEffect',
      payload: {
        queryType: LEAVE_QUERY_TYPE.SELF,
        type: currentPayloadTypes,
        status: Object.values(TIMEOFF_STATUS),
      },
    });
  };

  useEffect(() => {
    setSelectedTabNumber(currentFilterTab);
    dispatch({
      type: 'timeOff/savePaging',
      payload: { page: 1 },
    });
  }, [currentFilterTab]);

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

    dispatch({
      type: `timeOff/${type === 1 ? 'fetchLeaveRequests' : 'fetchMyCompoffRequests'}`,
      payload: {
        status,
        queryType: LEAVE_QUERY_TYPE.SELF,
        type: timeOffTypes.length === 0 ? currentPayloadTypes : timeOffTypes,
        search,
        fromDate: fromDate ? moment(fromDate).format(TIMEOFF_DATE_FORMAT_API) : null,
        toDate: toDate ? moment(toDate).format(TIMEOFF_DATE_FORMAT_API) : null,
        page,
        limit,
      },
    });
  };

  useEffect(() => {
    if (currentPayloadTypes.length) {
      fetchData();
    }
  }, [selectedTabNumber, page, limit, JSON.stringify(filter), JSON.stringify(currentPayloadTypes)]);

  useEffect(() => {
    if (currentPayloadTypes.length) {
      getTotalByStatus();
    }
  }, [JSON.stringify(currentPayloadTypes)]);

  return (
    <div className={styles.TimeOffRequestTab}>
      <FilterBar totalByStatus={totalByStatus} setSelectedFilterTab={setSelectedFilterTab} />
      <div className={styles.tableContainer}>
        {type === 1 && (
          <>
            <MyLeaveTable data={allLeaveRequests} tab={tab} />
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
  loading1: loading.effects['timeOff/fetchLeaveRequests'],
  loading3: loading.effects['timeOff/fetchMyCompoffRequests'],
  loading4: loading.effects['timeOff/fetchTeamCompoffRequests'],
}))(TimeOffRequestTab);
