import React, { PureComponent } from 'react';
import { Tabs } from 'antd';
import { connect } from 'umi';
import MineOrTeamTabs from './components/MineOrTeamTabs';

import styles from './index.less';

const { TabPane } = Tabs;
@connect(({ timeOff, loading, user }) => ({
  loading:
    loading.effects[
      'timeOff/fetchLeaveRequestOfEmployee' ||
        'timeOff/fetchMyCompoffRequests' ||
        'timeOff/fetchTeamLeaveRequests' ||
        'timeOff/fetchTeamCompoffRequests'
    ],
  timeOff,
  user,
}))
class TimeOffRequestsTable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getDataFromServer = () => {
    const {
      dispatch,
      user: { currentUser: { employee: { _id = '' } = {} } = {} } = {},
    } = this.props;

    dispatch({
      type: 'timeOff/fetchLeaveRequestOfEmployee',
      employee: _id,
    });

    dispatch({
      type: 'timeOff/fetchMyCompoffRequests',
    });

    dispatch({
      type: 'timeOff/fetchTeamLeaveRequests',
    });

    dispatch({
      type: 'timeOff/fetchTeamCompoffRequests',
    });
  };

  componentDidMount = () => {
    this.getDataFromServer();
  };

  renderTableTitle = {
    left: (
      <div className={styles.renderTableTitle}>
        <span>Timeoff Requests</span>
      </div>
    ),
  };

  onTabClick = () => {
    this.getDataFromServer();
  };

  renderDataMyRequests = (requests, key) => {
    // if (key === 1)
    //   return requests.filter((req) => {
    //     const { type: { type = '' } = {} } = req;
    //     return type === 'A' || type === 'B';
    //   });
    //
    // if (key === 2)
    //   return requests.filter((req) => {
    //     const { type: { type = '' } = {} } = req;
    //     return type === 'C';
    //   });
    //
    // if (key === 3)
    //   return requests.filter((req) => {
    //     const { type: { type = '', shortType = '' } = {} } = req;
    //     return type === 'C' && shortType === 'LWP';
    //   });
    //
    // if (key === 4)
    //   return requests.filter((req) => {
    //     const { type: { type = '' } = {} } = req;
    //     return type === 'D';
    //   });

    // compoff requests
    if (key === 5) {
      return requests;
    }

    return requests;
  };

  renderDataTeamRequests = (requests, key) => {
    // if (key === 1)
    //   return requests.filter((req) => {
    //     const { type: { type = '' } = {} } = req;
    //     return type === 'A' || type === 'B';
    //   });
    //
    // if (key === 2)
    //   return requests.filter((req) => {
    //     const { type: { type = '' } = {} } = req;
    //     return type === 'C';
    //   });
    //
    // if (key === 3)
    //   return requests.filter((req) => {
    //     const { type: { type = '', shortType = '' } = {} } = req;
    //     return type === 'C' && shortType === 'LWP';
    //   });
    //
    // if (key === 4)
    //   return requests.filter((req) => {
    //     const { type: { type = '' } = {} } = req;
    //     return type === 'D';
    //   });

    // compoff requests
    if (key === 5) {
      return requests;
    }

    return requests;
  };

  render() {
    const {
      timeOff: {
        leaveRequests: { items: items1 = [] } = {},
        compoffRequests: { items: items2 = [] } = {},
        teamCompoffRequests: { items: items3 = [] } = {},
        teamLeaveRequests: { items: items4 = [] } = {},
      } = {},
      loading,
    } = this.props;

    const leaveRequestsData1 = this.renderDataTeamRequests(items4, 1);
    const specialRequestsData1 = this.renderDataTeamRequests(items4, 2);
    const lwpRequestsData1 = this.renderDataTeamRequests(items4, 3);
    const wfhRequestsData1 = this.renderDataTeamRequests(items4, 4);
    const compoffRequestsData1 = this.renderDataTeamRequests(items3, 5);

    const leaveRequestsData2 = this.renderDataMyRequests(items1, 1);
    const specialRequestsData2 = this.renderDataMyRequests(items1, 2);
    const lwpRequestsData2 = this.renderDataMyRequests(items1, 3);
    const wfhRequestsData2 = this.renderDataMyRequests(items1, 4);
    const compoffRequestsData2 = this.renderDataMyRequests(items2, 5);

    return (
      <div className={styles.TimeOffRequestsTable}>
        <Tabs
          tabPosition="left"
          tabBarGutter={40}
          defaultActiveKey="1"
          tabBarExtraContent={this.renderTableTitle}
          onTabClick={this.onTabClick}
        >
          <>
            <TabPane tab="Leave Request" key="1">
              <MineOrTeamTabs
                loadingData={loading}
                data1={leaveRequestsData1}
                data2={leaveRequestsData2}
                type={1}
              />
            </TabPane>
            <TabPane tab="Special Leave Request" key="2">
              <MineOrTeamTabs
                loadingData={loading}
                data1={specialRequestsData1}
                data2={specialRequestsData2}
                type={1}
              />
            </TabPane>
            <TabPane tab="LWP Request" key="3">
              <MineOrTeamTabs
                loadingData={loading}
                data1={lwpRequestsData1}
                data2={lwpRequestsData2}
                type={1}
              />
            </TabPane>
            <TabPane tab="WFH/CP Requests" key="4">
              <MineOrTeamTabs
                loadingData={loading}
                data1={wfhRequestsData1}
                data2={wfhRequestsData2}
                type={1}
              />
            </TabPane>
            <TabPane tab="Compoff Request" key="5">
              <MineOrTeamTabs
                loadingData={loading}
                data1={compoffRequestsData1}
                data2={compoffRequestsData2}
                type={2}
              />
            </TabPane>
          </>
        </Tabs>
      </div>
    );
  }
}

export default TimeOffRequestsTable;
