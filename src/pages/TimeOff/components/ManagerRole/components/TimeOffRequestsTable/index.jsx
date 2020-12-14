import React, { PureComponent } from 'react';
import { Tabs, Spin } from 'antd';
import { connect } from 'umi';
import MineOrTeamTabs from './components/MineOrTeamTabs';

import styles from './index.less';

const { TabPane } = Tabs;
@connect(({ timeOff, loading, user }) => ({
  loadingFetchLeaveRequests: loading.effects['timeOff/fetchLeaveRequestOfEmployee'],
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

  renderDataTeamRequests = (requests, key) => {
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

  renderLoading = () => {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '180px 0',
          // height: '310px',
        }}
      >
        <Spin size="medium" />
      </div>
    );
  };

  render() {
    const {
      timeOff: { leaveRequests = [], compoffRequests: { items = [] } = {} } = {},
      loadingFetchLeaveRequests,
    } = this.props;

    // console.log('compoffRequests', items);

    const leaveRequestsData1 = this.renderDataTeamRequests(leaveRequests, 1);
    const specialRequestsData1 = this.renderDataTeamRequests(leaveRequests, 2);
    const lwpRequestsData1 = this.renderDataTeamRequests(leaveRequests, 3);
    const wfhRequestsData1 = this.renderDataTeamRequests(leaveRequests, 4);
    const compoffRequestsData1 = this.renderDataTeamRequests(items, 5);

    const leaveRequestsData2 = this.renderDataMyRequests(leaveRequests, 1);
    const specialRequestsData2 = this.renderDataMyRequests(leaveRequests, 2);
    const lwpRequestsData2 = this.renderDataMyRequests(leaveRequests, 3);
    const wfhRequestsData2 = this.renderDataMyRequests(leaveRequests, 4);
    const compoffRequestsData2 = this.renderDataMyRequests(items, 5);

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
              {!loadingFetchLeaveRequests ? (
                <MineOrTeamTabs data1={leaveRequestsData1} data2={leaveRequestsData2} type={1} />
              ) : (
                this.renderLoading()
              )}
            </TabPane>
            <TabPane tab="Special Leave Request" key="2">
              {!loadingFetchLeaveRequests ? (
                <MineOrTeamTabs
                  data1={specialRequestsData1}
                  data2={specialRequestsData2}
                  type={1}
                />
              ) : (
                this.renderLoading()
              )}
            </TabPane>
            <TabPane tab="LWP Request" key="3">
              {!loadingFetchLeaveRequests ? (
                <MineOrTeamTabs data1={lwpRequestsData1} data2={lwpRequestsData2} type={1} />
              ) : (
                this.renderLoading()
              )}
            </TabPane>
            <TabPane tab="WFH/CP Requests" key="4">
              {!loadingFetchLeaveRequests ? (
                <MineOrTeamTabs data1={wfhRequestsData1} data2={wfhRequestsData2} type={1} />
              ) : (
                this.renderLoading()
              )}
            </TabPane>
            <TabPane tab="Compoff Request" key="5">
              {!loadingFetchLeaveRequests ? (
                <MineOrTeamTabs
                  data1={compoffRequestsData1}
                  data2={compoffRequestsData2}
                  type={2}
                />
              ) : (
                this.renderLoading()
              )}
            </TabPane>
          </>
        </Tabs>
      </div>
    );
  }
}

export default TimeOffRequestsTable;
