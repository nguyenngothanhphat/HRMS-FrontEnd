import React, { PureComponent } from 'react';
import { connect } from 'umi';
import TeamLeaveTable from '../TeamLeaveTable';
import TeamCompoffTable from '../TeamCompoffTable';
import MyLeaveTable from '../../../../../EmployeeLandingPage/components/TimeOffRequestsTable/components/MyLeaveTable';
import MyCompoffTable from '../../../../../EmployeeLandingPage/components/TimeOffRequestsTable/components/MyCompoffTable';
import FilterBar from '../FilterBar';

import styles from './index.less';

@connect(({ timeOff, user, timeOff: { currentUserRole = '' } = {} }) => ({
  timeOff,
  user,
  currentUserRole,
}))
class TimeOffRequestTab extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      formatData: [],
      inProgressLength: 0,
      approvedLength: 0,
      rejectedLength: 0,
      draftLength: 0,
      selectedTab: 'IN-PROGRESS',
      onHoldLength: 0,
      handlePackage: {},
    };
  }

  getDataByType = (requests, key) => {
    if (key === 1)
      return requests.filter((req) => {
        const { type: { type = '' } = {} } = req;
        return type === 'A' || type === 'B';
      });

    if (key === 2)
      return requests.filter((req) => {
        const { type: { type = '' } = {} } = req;
        return type === 'C';
      });

    if (key === 3)
      return requests.filter((req) => {
        const { type: { type = '', shortType = '' } = {} } = req;
        return type === 'C' && shortType === 'LWP';
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

    let status = '';
    if (tabType === 1) {
      if (filterTab === '1') {
        status = 'IN-PROGRESS';
      }
      if (filterTab === '2') {
        status = 'ACCEPTED';
      }
      if (filterTab === '3') {
        status = 'REJECTED';
      }
      if (filterTab === '4') {
        status = 'DRAFTS';
      }
      if (filterTab === '5') {
        status = 'ON-HOLD';
      }
    } else if (tabType === 2) {
      // compoff
      if (filterTab === '1') {
        if (currentUserRole === 'ADMIN-CLA') {
          status = ['IN-PROGRESS-NEXT', 'IN-PROGRESS'];
        } else status = ['IN-PROGRESS'];
      }
      if (filterTab === '2') {
        if (currentUserRole === 'ADMIN-CLA') {
          status = ['ACCEPTED'];
        } else status = ['IN-PROGRESS-NEXT', 'ACCEPTED'];
      }
      if (filterTab === '3') {
        status = ['REJECTED'];
      }
      if (filterTab === '4') {
        status = ['DRAFTS'];
      }
      if (filterTab === '5') {
        status = ['ON-HOLD'];
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

    let selectedTab = 'IN-PROGRESS';
    if (id === '2') {
      selectedTab = 'ACCEPTED';
    } else if (id === '3') {
      selectedTab = 'REJECTED';
    } else if (id === '4') {
      selectedTab = 'DRAFTS';
    } else if (id === '5') {
      selectedTab = 'ON-HOLD';
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
      if (currentUserRole === 'ADMIN-CLA') {
        switch (status) {
          case 'IN-PROGRESS-NEXT': {
            inProgressLength.push(row);
            break;
          }
          default:
            break;
        }
      } else if (currentUserRole !== 'ADMIN-CLA') {
        switch (status) {
          case 'IN-PROGRESS-NEXT': {
            approvedLength.push(row);
            break;
          }
          default:
            break;
        }
      }

      switch (status) {
        case 'IN-PROGRESS': {
          inProgressLength.push(row);
          break;
        }
        case 'ACCEPTED': {
          approvedLength.push(row);
          break;
        }
        case 'REJECTED': {
          rejectedLength.push(row);
          break;
        }
        case 'DRAFTS': {
          draftLength.push(row);
          break;
        }
        case 'ON-HOLD': {
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

  render() {
    const { type = 0, category = '' } = this.props;

    const {
      formatData,
      inProgressLength,
      approvedLength,
      rejectedLength,
      draftLength,
      selectedTab,
      onHoldLength,
      handlePackage,
    } = this.state;

    const dataNumber = {
      inProgressLength,
      approvedLength,
      rejectedLength,
      draftLength,
      onHoldLength,
    };

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
          </div>
        </div>
      </div>
    );
  }
}
export default TimeOffRequestTab;
