import React, { Component } from 'react';
import { connect } from 'umi';
import EmptyIcon from '@/assets/timeOffTableEmptyIcon.svg';
import { TIMEOFF_STATUS } from '@/utils/timeOff';
import TeamLeaveTable from '../../../../../ManagerLandingPage/components/TimeOffRequestsTable/components/TeamLeaveTable';
import TeamCompoffTable from '../../../../../ManagerLandingPage/components/TimeOffRequestsTable/components/TeamCompoffTable';
import MyLeaveTable from '../../../../../EmployeeLandingPage/components/TimeOffRequestsTable/components/MyLeaveTable';
import MyCompoffTable from '../../../../../EmployeeLandingPage/components/TimeOffRequestsTable/components/MyCompoffTable';
import FilterBar from '../FilterBar';

import styles from './index.less';

const { IN_PROGRESS, IN_PROGRESS_NEXT, ACCEPTED, ON_HOLD, REJECTED, DELETED, DRAFTS } =
  TIMEOFF_STATUS;
@connect(
  ({
    timeOff,
    loading,
    user,
    timeOff: {
      filter = {},
      timeOffTypesByCountry,
      paging,
      compoffRequests = [],
      leaveRequests = [],
      teamCompoffRequests = [],
      teamLeaveRequests = [],
    } = {},
  }) => ({
    timeOff,
    paging,
    user,
    filter,
    timeOffTypesByCountry,

    teamCompoffRequests,
    teamLeaveRequests,
    compoffRequests,
    leaveRequests,
    loading1: loading.effects['timeOff/fetchLeaveRequestOfEmployee'],
    loading2: loading.effects['timeOff/fetchTeamLeaveRequests'],
    loading3: loading.effects['timeOff/fetchMyCompoffRequests'],
    loading4: loading.effects['timeOff/fetchTeamCompoffRequests'],
  }),
)
class TimeOffRequestTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inProgressLength: 0,
      approvedLength: 0,
      rejectedLength: 0,
      draftLength: 0,
      selectedTab: IN_PROGRESS,
      selectedTabNumber: '0',
      onHoldLength: 0,
      deletedLength: 0,
      handlePackage: {},
    };
  }

  componentDidMount = () => {
    const {
      dispatch,
      timeOff: { currentFilterTab, currentLeaveTypeTab, timeOffTypesByCountry } = {},
    } = this.props;
    if (currentLeaveTypeTab === '1') {
      let arr = timeOffTypesByCountry.filter((timeOffType) => timeOffType.type === 'A');
      arr = arr.map((item) => item._id);
      dispatch({
        type: 'timeOff/saveFilter',
        payload: {
          type: arr,
          isSearch: true,
        },
      });
    }
    this.setState({ selectedTabNumber: '1' });
    // this.fetchFilteredDataFromServer('1');
    this.setSelectedFilterTab(currentFilterTab);
  };

  componentDidUpdate(prevProps, prevState) {
    const { selectedTabNumber } = this.state;
    const {
      filter: { isSearch },
      dispatch,
      paging: { page },
    } = this.props;

    if (
      isSearch ||
      selectedTabNumber !== prevState.selectedTabNumber ||
      page !== prevProps.paging.page
    ) {
      this.fetchFilteredDataFromServer(selectedTabNumber);
      this.saveCurrentTab(selectedTabNumber);
      dispatch({
        type: 'timeOff/saveFilter',
        payload: { isSearch: false },
      });
    }
  }

  getTypeToDispatch = (tabType, category) => {
    let type = '';
    if (tabType === 1) {
      if (category === 'MY') type = 'timeOff/fetchLeaveRequestOfEmployee';
      else if (category === 'TEAM') type = 'timeOff/fetchTeamLeaveRequests';
      else type = 'timeOff/fetchTeamLeaveRequests';
    }
    if (tabType === 2) {
      if (category === 'MY') type = 'timeOff/fetchMyCompoffRequests';
      else if (category === 'TEAM') type = 'timeOff/fetchTeamCompoffRequests';
      else type = 'timeOff/fetchTeamCompoffRequests';
    }
    return type;
  };

  fetchFilteredDataFromServer = (filterTab) => {
    const {
      dispatch,
      type: tabType = 0,
      category = '',
      filter: { search, fromDate, toDate, type: timeOffTypes },
      paging: { page, limit },
    } = this.props;

    let status = '';
    if (tabType === 1) {
      if (filterTab === '1') {
        status = IN_PROGRESS;
      }
      if (filterTab === '2') {
        status = ACCEPTED;
      }
      if (filterTab === '3') {
        status = REJECTED;
      }
      if (filterTab === '4') {
        status = DRAFTS;
      }
      if (filterTab === '5') {
        status = ON_HOLD;
      }
      if (filterTab === '6') {
        status = DELETED;
      }
    } else if (tabType === 2) {
      // compoff
      if (filterTab === '1') {
        status = [IN_PROGRESS_NEXT, IN_PROGRESS];
      }
      if (filterTab === '2') {
        status = [ACCEPTED];
      }
      if (filterTab === '3') {
        status = [REJECTED];
      }
      if (filterTab === '4') {
        status = [DRAFTS];
      }
      if (filterTab === '5') {
        status = [ON_HOLD];
      }
      if (filterTab === '6') {
        status = [DELETED];
      }
    }

    const commonFunction = (res = {}) => {
      const { data: { total = [] } = {}, statusCode } = res;
      if (statusCode === 200) {
        this.countTotal(total);
      }
    };

    const types = this.getTypeToDispatch(tabType, category);
    dispatch({
      type: types,
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
      commonFunction(res);
    });
  };

  saveCurrentTab = (type) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'timeOff/save',
      payload: {
        currentFilterTab: String(type),
      },
    });
  };

  setSelectedFilterTab = (id) => {
    let selectedTab = IN_PROGRESS;
    if (id === '2') {
      selectedTab = ACCEPTED;
    } else if (id === '3') {
      selectedTab = REJECTED;
    } else if (id === '4') {
      selectedTab = DRAFTS;
    } else if (id === '5') {
      selectedTab = ON_HOLD;
    } else if (id === '6') {
      selectedTab = DELETED;
    }

    this.setState({
      selectedTab,
      selectedTabNumber: id,
    });
  };

  countTotal = (arrTotal) => {
    let inProgressLength = 0;
    let approvedLength = 0;
    let rejectedLength = 0;
    let draftLength = 0;
    let onHoldLength = 0;
    let deletedLength = 0;

    arrTotal.forEach((item) => {
      switch (item._id) {
        case IN_PROGRESS: {
          inProgressLength += item.count;
          break;
        }
        case IN_PROGRESS_NEXT: {
          inProgressLength += item.count;
          break;
        }
        case ACCEPTED: {
          approvedLength += item.count;
          break;
        }
        case REJECTED: {
          rejectedLength += item.count;
          break;
        }
        case DRAFTS: {
          draftLength += item.count;
          break;
        }
        case ON_HOLD: {
          onHoldLength += item.count;
          break;
        }
        case DELETED: {
          deletedLength += item.count;
          break;
        }
        default:
          break;
      }
    });
    this.setState({
      inProgressLength,
      approvedLength,
      rejectedLength,
      draftLength,
      onHoldLength,
      deletedLength,
    });
  };

  onApproveRejectHandle = (obj) => {
    this.setState({
      handlePackage: obj,
    });
  };

  renderEmptyTableContent = (tab, category) => {
    if (category === 'MY') {
      switch (tab) {
        case 1:
          return (
            <>
              You have not applied for any Leave requests. <br />
              Submitted Casual, Sick & Compoff requests will be displayed here.
            </>
          );
        case 2:
          return (
            <>
              You have not applied for any Special Leave requests.
              <br />
              Submitted Restricted Holiday, Bereavement, Marriage & Maternity/ Paternity leave
              requests will be displayed here.
            </>
          );
        case 3:
          return <>You have not applied for any LWP requests.</>;
        case 4:
          return <>You have not applied any request to Work from home or Client’s place.</>;
        case 5:
          return <>You have not submitted any requests to earn compensation leaves.</>;
        default:
          return '';
      }
    }
    if (category === 'TEAM' || category === 'ALL') {
      switch (tab) {
        case 1:
          return (
            <>
              No Leave requests received. <br />
              Submitted Casual, Sick & Compoff requests will be displayed here.
            </>
          );
        case 2:
          return (
            <>
              No Special Leave requests received. <br />
              Submitted Restricted Holiday, Bereavement, Marriage & Maternity/ Paternity leave
              requests will be displayed here.
            </>
          );
        case 3:
          return (
            <>
              No LWP requests received. <br />
            </>
          );
        case 4:
          return <>No Work from home or Client’s place requests received.</>;
        case 5:
          return <>No Compoff requests received.</>;
        default:
          return '';
      }
    }
    return '';
  };

  render() {
    const {
      type = 0,
      category = '',
      tab = 0,
      loading1,
      loading2,
      loading3,
      loading4,
      compoffRequests = [],
      leaveRequests = [],
      teamCompoffRequests = [],
      teamLeaveRequests = [],
    } = this.props;

    const {
      inProgressLength,
      approvedLength,
      rejectedLength,
      draftLength,
      selectedTab,
      selectedTabNumber,
      onHoldLength,
      deletedLength,
      handlePackage,
    } = this.state;

    const dataNumber = {
      inProgressLength,
      approvedLength,
      rejectedLength,
      draftLength,
      onHoldLength,
      deletedLength,
    };

    const checkEmptyTable = false;

    const emptyTableContent = this.renderEmptyTableContent(tab, category);

    return (
      <div className={styles.TimeOffRequestTab}>
        <FilterBar
          dataNumber={dataNumber}
          setSelectedFilterTab={this.setSelectedFilterTab}
          category={category}
          selectedTab={selectedTabNumber}
          handlePackage={handlePackage}
        />
        <div className={styles.tableContainer}>
          <div>
            {checkEmptyTable && !loading1 && !loading2 && !loading3 && !loading4 ? (
              <div className={styles.emptyTable}>
                <img src={EmptyIcon} alt="empty-table" />
                <p className={styles.describeTexts}>{emptyTableContent}</p>
              </div>
            ) : (
              <>
                {type === 1 && category === 'MY' && (
                  <MyLeaveTable data={leaveRequests} selectedTab={selectedTab} />
                )}
                {type === 2 && category === 'MY' && (
                  <MyCompoffTable data={compoffRequests} selectedTab={selectedTab} />
                )}
                {type === 1 && category === 'TEAM' && (
                  <TeamLeaveTable
                    data={teamLeaveRequests}
                    category={category}
                    selectedTab={selectedTab}
                    onRefreshTable={this.setSelectedFilterTab}
                    onHandle={this.onApproveRejectHandle}
                  />
                )}
                {type === 2 && category === 'TEAM' && (
                  <TeamCompoffTable
                    data={teamCompoffRequests}
                    category={category}
                    selectedTab={selectedTab}
                    onRefreshTable={this.setSelectedFilterTab}
                    onHandle={this.onApproveRejectHandle}
                  />
                )}
                {type === 1 && category === 'ALL' && (
                  <TeamLeaveTable
                    data={teamLeaveRequests}
                    selectedTab={selectedTab}
                    onRefreshTable={this.setSelectedFilterTab}
                    onHandle={this.onApproveRejectHandle}
                  />
                )}

                {type === 2 && category === 'ALL' && (
                  <TeamCompoffTable
                    data={teamCompoffRequests}
                    selectedTab={selectedTab}
                    onRefreshTable={this.setSelectedFilterTab}
                    onHandle={this.onApproveRejectHandle}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}
export default TimeOffRequestTab;
