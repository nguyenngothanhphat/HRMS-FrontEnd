import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { TIMEOFF_DATE_FORMAT_API, LEAVE_QUERY_TYPE, TIMEOFF_STATUS } from '@/constants/timeOff';
import MyLeaveTable from '@/pages/TimeOff/components/Overview/components/EmployeeRequestTable/components/MyLeaveTable';
import useCancelToken from '@/utils/hooks';
import { getShortType } from '@/utils/timeOff';
import { debounceFetchData } from '@/utils/utils';
import FilterBar from '../FilterBar';
import TeamLeaveTable from '../TeamLeaveTable';
import styles from './index.less';

const { IN_PROGRESS, ACCEPTED, ON_HOLD, REJECTED, DRAFTS, WITHDRAWN, DELETED } = TIMEOFF_STATUS;

const TimeOffRequestTab = (props) => {
  const {
    timeOff: {
      currentFilterTab,
      filter: { search, fromDate, toDate, type: timeOffTypes = [] },
      filter = {},
      paging: { page, limit },
      currentScopeTab = '',
      totalByStatus = {},
      allLeaveRequests = [],
      currentPayloadTypes = [],
      currentLeaveTypeTab = '',
    } = {},
    category = '',
    tab = 0,
    user: { permissions = {} },
    dispatch,
  } = props;

  const [selectedTabNumber, setSelectedTabNumber] = useState('1');
  const [handlePackage, setHandlePackage] = useState({});
  const [selectedTab, setSelectedTab] = useState(IN_PROGRESS);
  const { cancelToken, cancelRequest } = useCancelToken();
  const { cancelToken: cancelToken2, cancelRequest: cancelRequest2 } = useCancelToken();

  const setSelectedFilterTab = (id) => {
    dispatch({
      type: 'timeOff/save',
      payload: {
        currentFilterTab: String(id),
      },
    });
  };

  useEffect(() => {
    let selectedTabTemp = IN_PROGRESS;
    if (currentFilterTab === '2') {
      selectedTabTemp = ACCEPTED;
    } else if (currentFilterTab === '3') {
      selectedTabTemp = REJECTED;
    } else if (currentFilterTab === '4') {
      selectedTabTemp = DRAFTS;
    } else if (currentFilterTab === '5') {
      selectedTabTemp = WITHDRAWN;
    } else if (currentFilterTab === '6') {
      selectedTabTemp = DELETED;
    }
    setSelectedTab(selectedTabTemp);
    setSelectedTabNumber(currentFilterTab);
    dispatch({
      type: 'timeOff/savePaging',
      payload: { page: 1 },
    });
  }, [currentFilterTab]);

  const getTotalByType = () => {
    const payload = {
      type: getShortType(currentLeaveTypeTab),
      status: [IN_PROGRESS, ON_HOLD],
      cancelToken: cancelToken2(),
    };
    if (category !== LEAVE_QUERY_TYPE.SELF) {
      payload.isTeam = category === LEAVE_QUERY_TYPE.TEAM ? true : null;
    } else {
      payload.isTeam = false;
    }
    dispatch({
      type: 'timeOff/getTotalByTypeEffect',
      payload,
    });
  };

  const getTotalByStatus = () => {
    dispatch({
      type: 'timeOff/getTotalByStatusEffect',
      payload: {
        queryType: Object.values(LEAVE_QUERY_TYPE)[currentScopeTab - 1],
        type: currentPayloadTypes,
        status: Object.values(TIMEOFF_STATUS),
      },
    });
  };

  const fetchData = () => {
    let status = '';
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
    if (selectedTabNumber === '6') {
      status = [DELETED];
    }

    dispatch({
      type: 'timeOff/fetchLeaveRequests',
      payload: {
        status,
        queryType: LEAVE_QUERY_TYPE[category],
        type: timeOffTypes.length === 0 ? currentPayloadTypes : timeOffTypes,
        search,
        fromDate: fromDate ? moment(fromDate).format(TIMEOFF_DATE_FORMAT_API) : null,
        toDate: toDate ? moment(toDate).format(TIMEOFF_DATE_FORMAT_API) : null,
        page,
        limit,
        cancelToken: cancelToken(),
      },
    });
  };

  useEffect(() => {
    if (currentPayloadTypes.length) {
      debounceFetchData(fetchData);
      return () => {
        cancelRequest();
        cancelRequest2();
      };
    }
    return () => {};
  }, [selectedTabNumber, page, limit, JSON.stringify(filter), JSON.stringify(currentPayloadTypes)]);

  useEffect(() => {
    if (currentLeaveTypeTab) getTotalByType();
  }, [currentLeaveTypeTab]);

  useEffect(() => {
    if (currentPayloadTypes.length) {
      getTotalByStatus();
    }
  }, [JSON.stringify(currentPayloadTypes)]);

  const onApproveRejectHandle = (obj) => {
    setHandlePackage(obj);
  };

  const viewHRTimeoff = permissions.viewHRTimeoff !== -1;

  return (
    <div className={styles.TimeOffRequestTab}>
      <FilterBar
        totalByStatus={totalByStatus}
        setSelectedFilterTab={setSelectedFilterTab}
        category={category}
        handlePackage={handlePackage}
      />
      <div className={styles.tableContainer}>
        {category === LEAVE_QUERY_TYPE.SELF ? (
          <MyLeaveTable data={allLeaveRequests} selectedTab={selectedTab} tab={tab} />
        ) : (
          <TeamLeaveTable
            data={allLeaveRequests}
            category={category}
            selectedTab={selectedTab}
            onRefreshTable={fetchData}
            onHandle={onApproveRejectHandle}
            tab={tab}
            isHR={viewHRTimeoff}
          />
        )}
      </div>
    </div>
  );
};
export default connect(({ timeOff, user }) => ({
  timeOff,
  user,
}))(TimeOffRequestTab);
