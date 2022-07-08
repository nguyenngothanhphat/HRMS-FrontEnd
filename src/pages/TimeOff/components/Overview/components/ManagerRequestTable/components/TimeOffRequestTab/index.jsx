import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import MyCompoffTable from '@/pages/TimeOff/components/Overview/components/EmployeeRequestTable/components/MyCompoffTable';
import MyLeaveTable from '@/pages/TimeOff/components/Overview/components/EmployeeRequestTable/components/MyLeaveTable';
import ROLES from '@/utils/roles';
import { TIMEOFF_DATE_FORMAT_API, TIMEOFF_STATUS } from '@/utils/timeOff';
import FilterBar from '../FilterBar';
import TeamCompoffTable from '../TeamCompoffTable';
import TeamLeaveTable from '../TeamLeaveTable';
import styles from './index.less';

const { REGION_HEAD } = ROLES;
const { IN_PROGRESS, IN_PROGRESS_NEXT, ACCEPTED, ON_HOLD, REJECTED, DRAFTS, WITHDRAWN, DELETED } =
  TIMEOFF_STATUS;

const TimeOffRequestTab = (props) => {
  const {
    timeOff: {
      currentFilterTab,
      filter: { search, fromDate, toDate, type: timeOffTypes = [] },
      filter = {},
      paging: { page, limit },
      compoffRequests = [],
      leaveRequests = [],
      currentUserRole = '',
      teamCompoffRequests = [],
      teamLeaveRequests = [],
      allLeaveRequests = [],
    } = {},
    category = '',
    type = 0,
    tab = 0,
    user: { permissions = {} },
    dispatch,
  } = props;

  const [inProgressLength, setInProgressLength] = useState(0);
  const [approvedLength, setApprovedLength] = useState(0);
  const [rejectedLength, setRejectedLength] = useState(0);
  const [draftLength, setDraftLength] = useState(0);
  const [withdrawnLength, setWithdrawnLength] = useState(0);
  const [deletedLength, setDeletedLength] = useState(0);
  const [selectedTabNumber, setSelectedTabNumber] = useState('1');
  const [handlePackage, setHandlePackage] = useState({});
  const [selectedTab, setSelectedTab] = useState(IN_PROGRESS);

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
  }, [currentFilterTab]);

  const countTotal = (newData) => {
    let inProgressLengthTemp = 0;
    let approvedLengthTemp = 0;
    let rejectedLengthTemp = 0;
    let draftLengthTemp = 0;
    let withdrawnLengthTemp = 0;
    let deletedLengthTemp = 0;

    newData.forEach((item) => {
      const { _id: status = '' } = item;
      if (currentUserRole === REGION_HEAD) {
        switch (status) {
          case IN_PROGRESS_NEXT: {
            inProgressLengthTemp += item.count;
            break;
          }
          default:
            break;
        }
      } else if (currentUserRole !== REGION_HEAD) {
        switch (status) {
          case IN_PROGRESS_NEXT: {
            approvedLengthTemp += item.count;
            break;
          }
          default:
            break;
        }
      }

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
        case DELETED:
          deletedLengthTemp += item.count;
          break;

        default:
          break;
      }
    });
    setInProgressLength(inProgressLengthTemp);
    setApprovedLength(approvedLengthTemp);
    setRejectedLength(rejectedLengthTemp);
    setDraftLength(draftLengthTemp);
    setWithdrawnLength(withdrawnLengthTemp);
    setDeletedLength(deletedLengthTemp);
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
      if (selectedTabNumber === '6') {
        status = [DELETED];
      }
    } else if (type === 2) {
      // compoff
      if (selectedTabNumber === '1') {
        if (currentUserRole === REGION_HEAD) {
          status = [IN_PROGRESS_NEXT, IN_PROGRESS];
        } else status = [IN_PROGRESS];
      }
      if (selectedTabNumber === '2') {
        if (currentUserRole === REGION_HEAD) {
          status = [ACCEPTED];
        } else status = [IN_PROGRESS_NEXT, ACCEPTED];
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
      if (selectedTabNumber === '6') {
        status = [DELETED];
      }
    }

    let typeAPI = '';
    if (type === 1) {
      if (category === 'MY') typeAPI = 'timeOff/fetchLeaveRequestOfEmployee';
      else if (category === 'ALL') typeAPI = 'timeOff/fetchAllLeaveRequests';
      else typeAPI = 'timeOff/fetchTeamLeaveRequests';
    }
    if (type === 2) {
      if (category === 'MY') typeAPI = 'timeOff/fetchMyCompoffRequests';
      else typeAPI = 'timeOff/fetchTeamCompoffRequests';
    }

    dispatch({
      type: typeAPI,
      payload: {
        status,
        type: timeOffTypes,
        search,
        fromDate: fromDate ? moment(fromDate).format(TIMEOFF_DATE_FORMAT_API) : null,
        toDate: toDate ? moment(toDate).format(TIMEOFF_DATE_FORMAT_API) : null,
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
  }, [selectedTabNumber, page, limit, JSON.stringify(filter)]);

  const onApproveRejectHandle = (obj) => {
    setHandlePackage(obj);
  };

  const dataNumber = {
    inProgressLength,
    approvedLength,
    rejectedLength,
    draftLength,
    withdrawnLength,
    deletedLength,
  };

  const viewHRTimeoff = permissions.viewHRTimeoff !== -1;

  return (
    <div className={styles.TimeOffRequestTab}>
      <FilterBar
        dataNumber={dataNumber}
        setSelectedFilterTab={setSelectedFilterTab}
        category={category}
        handlePackage={handlePackage}
      />
      <div className={styles.tableContainer}>
        {type === 1 && category === 'ALL' && (
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
        {type === 1 && category === 'TEAM' && (
          <TeamLeaveTable
            data={teamLeaveRequests}
            category={category}
            selectedTab={selectedTab}
            onRefreshTable={fetchData}
            onHandle={onApproveRejectHandle}
            tab={tab}
            isHR={viewHRTimeoff}
          />
        )}
        {type === 1 && category === 'MY' && (
          <MyLeaveTable data={leaveRequests} selectedTab={selectedTab} tab={tab} />
        )}
        {type === 2 && category === 'TEAM' && (
          <TeamCompoffTable
            data={teamCompoffRequests}
            category={category}
            selectedTab={selectedTab}
            onRefreshTable={fetchData}
            onHandle={onApproveRejectHandle}
            isHR={viewHRTimeoff}
            tab={tab}
          />
        )}
        {type === 2 && category === 'MY' && (
          <MyCompoffTable data={compoffRequests} selectedTab={selectedTab} tab={tab} />
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
