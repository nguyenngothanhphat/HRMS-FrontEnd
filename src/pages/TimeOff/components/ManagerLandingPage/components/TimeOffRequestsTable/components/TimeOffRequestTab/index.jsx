import React, { PureComponent } from 'react';
import { connect } from 'umi';
import TeamLeaveTable from '../TeamLeaveTable';
import TeamCompoffTable from '../TeamCompoffTable';
import MyLeaveTable from '../../../../../EmployeeLandingPage/components/TimeOffRequestsTable/components/MyLeaveTable';
import MyCompoffTable from '../../../../../EmployeeLandingPage/components/TimeOffRequestsTable/components/MyCompoffTable';
import FilterBar from '../FilterBar';

import styles from './index.less';

@connect(({ timeOff, user }) => ({
  timeOff,
  user,
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
      selectedTabNumber: '1',
      onHoldLength: 0,
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
    const { dispatch, tab = 0, type: tabType = 0, category = '' } = this.props;
    const { user: { currentUser: { employee: { _id = '' } = {} } = {} } = {} } = this.props;

    let status = '';
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
    this.fetchAllData();
    this.fetchFilteredDataFromServer('1');
  };

  setSelectedFilterTab = (id) => {
    this.fetchAllData();
    this.fetchFilteredDataFromServer(id);

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
      selectedTabNumber: id,
    });
  };

  countTotal = (newData) => {
    const inProgressLength = [];
    const approvedLength = [];
    const rejectedLength = [];
    const draftLength = [];
    const onHoldLength = [];

    newData.forEach((row) => {
      const { status = '' } = row;
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

  render() {
    const { type = 0, category = '' } = this.props;

    const {
      formatData,
      inProgressLength,
      approvedLength,
      rejectedLength,
      draftLength,
      selectedTab,
      selectedTabNumber,
      onHoldLength,
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
          selectedTab={selectedTabNumber}
        />
        <div className={styles.tableContainer}>
          <div>
            {type === 1 && category === 'TEAM' && (
              <TeamLeaveTable
                data={formatData}
                category={category}
                selectedTab={selectedTab}
                onRefreshTable={this.setSelectedFilterTab}
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
