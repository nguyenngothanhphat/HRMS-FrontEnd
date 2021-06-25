import React, { PureComponent } from 'react';
import { connect } from 'umi';
import EmptyIcon from '@/assets/timeOffTableEmptyIcon.svg';
import { TIMEOFF_STATUS } from '@/utils/timeOff';
import TeamLeaveTable from '../TeamLeaveTable';
import TeamCompoffTable from '../TeamCompoffTable';
import MyLeaveTable from '../../../../../EmployeeLandingPage/components/TimeOffRequestsTable/components/MyLeaveTable';
import MyCompoffTable from '../../../../../EmployeeLandingPage/components/TimeOffRequestsTable/components/MyCompoffTable';
import FilterBar from '../FilterBar';

import styles from './index.less';

@connect(({ timeOff, loading, user, timeOff: { currentUserRole = '' } = {} }) => ({
  timeOff,
  user,
  currentUserRole,
  loading1: loading.effects['timeOff/fetchLeaveRequestOfEmployee'],
  loading2: loading.effects['timeOff/fetchTeamLeaveRequests'],
  loading3: loading.effects['timeOff/fetchMyCompoffRequests'],
  loading4: loading.effects['timeOff/fetchTeamCompoffRequests'],
}))
class TimeOffRequestTab extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      formatData: [],
      formatMainTabData: [],
      inProgressLength: 0,
      approvedLength: 0,
      rejectedLength: 0,
      draftLength: 0,
      selectedTab: TIMEOFF_STATUS.inProgress,
      onHoldLength: 0,
      handlePackage: {},
    };
  }

  getDataByType = (requests, key) => {
    if (key === 1)
      return requests.filter((req) => {
        const { type: { type = '' } = {} } = req;
        return type === 'A';
      });

    if (key === 2)
      return requests.filter((req) => {
        const { type: { type = '' } = {} } = req;
        return type === 'C';
      });

    if (key === 3)
      return requests.filter((req) => {
        const { type: { type = '' } = {} } = req;
        return type === 'B';
      });

    if (key === 4)
      return requests.filter((req) => {
        const { type: { type = '' } = {} } = req;
        return type === 'D';
      });

    // compoff requests
    if (key === 5) {
      return requests;
    }

    return [];
  };

  fetchFilteredDataFromServer = (filterTab) => {
    const {
      dispatch,
      tab = 0,
      type: tabType = 0,
      category = '',
      currentUserRole = '',
    } = this.props;
    const { user: { currentUser: { employee: { _id = '' } = {} } = {} } = {} } = this.props;
    console.log('_id', _id);
    let status = '';
    if (tabType === 1) {
      if (filterTab === '1') {
        status = TIMEOFF_STATUS.inProgress;
      }
      if (filterTab === '2') {
        status = TIMEOFF_STATUS.accepted;
      }
      if (filterTab === '3') {
        status = TIMEOFF_STATUS.rejected;
      }
      if (filterTab === '4') {
        status = TIMEOFF_STATUS.drafts;
      }
      if (filterTab === '5') {
        status = TIMEOFF_STATUS.onHold;
      }
    } else if (tabType === 2) {
      // compoff
      if (filterTab === '1') {
        if (currentUserRole === 'REGION-HEAD') {
          status = [TIMEOFF_STATUS.inProgressNext, TIMEOFF_STATUS.inProgress];
        } else status = [TIMEOFF_STATUS.inProgress];
      }
      if (filterTab === '2') {
        if (currentUserRole === 'REGION-HEAD') {
          status = [TIMEOFF_STATUS.accepted];
        } else status = [TIMEOFF_STATUS.inProgressNext, TIMEOFF_STATUS.accepted];
      }
      if (filterTab === '3') {
        status = [TIMEOFF_STATUS.rejected];
      }
      if (filterTab === '4') {
        status = [TIMEOFF_STATUS.drafts];
      }
      if (filterTab === '5') {
        status = [TIMEOFF_STATUS.onHold];
      }
    }

    const commonFunction = (res = {}) => {
      const { data: { items = [] } = {}, statusCode } = res;
      if (statusCode === 200) {
        const newData = this.getDataByType(items, tab);
        this.setState({
          formatData: newData,
        });
      }
    };

    let type = '';
    if (tabType === 1) {
      if (category === 'MY') type = 'timeOff/fetchLeaveRequestOfEmployee';
      else type = 'timeOff/fetchTeamLeaveRequests';
    }
    if (tabType === 2) {
      if (category === 'MY') type = 'timeOff/fetchMyCompoffRequests';
      else type = 'timeOff/fetchTeamCompoffRequests';
    }
    dispatch({
      type,
      employee: _id,
      status,
    }).then((res) => {
      commonFunction(res);
    });
  };

  fetchAllData = () => {
    const { dispatch, tab = 0, type: tabType = 0, category = '' } = this.props;

    let type = '';
    if (tabType === 1) {
      if (category === 'MY') type = 'timeOff/fetchLeaveRequestOfEmployee';
      else type = 'timeOff/fetchTeamLeaveRequests';
    }
    if (tabType === 2) {
      if (category === 'MY') type = 'timeOff/fetchMyCompoffRequests';
      else type = 'timeOff/fetchTeamCompoffRequests';
    }
    dispatch({
      type,
    }).then((res) => {
      const { data: { items = [] } = {}, statusCode } = res;
      if (statusCode === 200) {
        const newData = this.getDataByType(items, tab);
        this.countTotal(newData);
        let formatMainTabData = newData;
        if (category === 'TEAM') {
          formatMainTabData = formatMainTabData.filter(
            (data) =>
              data.status !== TIMEOFF_STATUS.deleted && data.status !== TIMEOFF_STATUS.drafts,
          );
        }
        if (category === 'MY') {
          formatMainTabData = formatMainTabData.filter(
            (data) => data.status !== TIMEOFF_STATUS.deleted,
          );
        }
        this.setState({
          formatMainTabData,
        });
      }
    });
  };

  componentDidMount = () => {
    const { timeOff: { currentFilterTab } = {} } = this.props;
    // this.fetchAllData();
    // this.fetchFilteredDataFromServer(currentFilterTab);
    this.setSelectedFilterTab(currentFilterTab);
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
    this.fetchAllData();
    this.fetchFilteredDataFromServer(id);
    this.saveCurrentTab(id);

    let selectedTab = TIMEOFF_STATUS.inProgress;
    if (id === '2') {
      selectedTab = TIMEOFF_STATUS.accepted;
    } else if (id === '3') {
      selectedTab = TIMEOFF_STATUS.rejected;
    } else if (id === '4') {
      selectedTab = TIMEOFF_STATUS.drafts;
    } else if (id === '5') {
      selectedTab = TIMEOFF_STATUS.onHold;
    }

    this.setState({
      selectedTab,
    });
  };

  countTotal = (newData) => {
    const { currentUserRole = '' } = this.props;
    const inProgressLength = [];
    const approvedLength = [];
    const rejectedLength = [];
    const draftLength = [];
    const onHoldLength = [];

    newData.forEach((row) => {
      const { status = '' } = row;
      if (currentUserRole === 'REGION-HEAD') {
        switch (status) {
          case TIMEOFF_STATUS.inProgressNext: {
            inProgressLength.push(row);
            break;
          }
          default:
            break;
        }
      } else if (currentUserRole !== 'REGION-HEAD') {
        switch (status) {
          case TIMEOFF_STATUS.inProgressNext: {
            approvedLength.push(row);
            break;
          }
          default:
            break;
        }
      }

      switch (status) {
        case TIMEOFF_STATUS.inProgress: {
          inProgressLength.push(row);
          break;
        }
        case TIMEOFF_STATUS.accepted: {
          approvedLength.push(row);
          break;
        }
        case TIMEOFF_STATUS.rejected: {
          rejectedLength.push(row);
          break;
        }
        case TIMEOFF_STATUS.drafts: {
          draftLength.push(row);
          break;
        }
        case TIMEOFF_STATUS.onHold: {
          onHoldLength.push(row);
          break;
        }
        default:
          break;
      }
    });
    this.setState({
      inProgressLength: inProgressLength.length,
      approvedLength: approvedLength.length,
      rejectedLength: rejectedLength.length,
      draftLength: draftLength.length,
      onHoldLength: onHoldLength.length,
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
    if (category === 'TEAM') {
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
    const { type = 0, category = '', tab = 0, loading1, loading2, loading3, loading4 } = this.props;

    const {
      formatData,
      inProgressLength,
      approvedLength,
      rejectedLength,
      draftLength,
      selectedTab,
      onHoldLength,
      handlePackage,
      formatMainTabData,
    } = this.state;

    const dataNumber = {
      inProgressLength,
      approvedLength,
      rejectedLength,
      draftLength,
      onHoldLength,
    };

    const checkEmptyTable = formatMainTabData.length === 0;

    const emptyTableContent = this.renderEmptyTableContent(tab, category);

    return (
      <div className={styles.TimeOffRequestTab}>
        <FilterBar
          dataNumber={dataNumber}
          setSelectedFilterTab={this.setSelectedFilterTab}
          category={category}
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
                {type === 1 && category === 'TEAM' && (
                  <TeamLeaveTable
                    data={formatData}
                    category={category}
                    selectedTab={selectedTab}
                    onRefreshTable={this.setSelectedFilterTab}
                    onHandle={this.onApproveRejectHandle}
                  />
                )}
                {type === 1 && category === 'MY' && (
                  <MyLeaveTable data={formatData} selectedTab={selectedTab} />
                )}
                {type === 2 && category === 'TEAM' && (
                  <TeamCompoffTable
                    data={formatData}
                    category={category}
                    selectedTab={selectedTab}
                    onRefreshTable={this.setSelectedFilterTab}
                    onHandle={this.onApproveRejectHandle}
                  />
                )}
                {type === 2 && category === 'MY' && (
                  <MyCompoffTable data={formatData} selectedTab={selectedTab} />
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
