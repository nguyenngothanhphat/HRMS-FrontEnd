import React, { PureComponent } from 'react';
import { Tabs, Spin } from 'antd';
import { connect } from 'umi';
import TimeOffRequestTab from './components/TimeOffRequestTab';

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

  renderData = (leaveRequests, key) => {
    if (key === 1)
      return leaveRequests.filter((req) => {
        const { type: { type = '' } = {} } = req;
        return type === 'A' || type === 'B';
      });

    if (key === 2)
      return leaveRequests.filter((req) => {
        const { type: { type = '' } = {} } = req;
        return type === 'C';
      });

    if (key === 3)
      return leaveRequests.filter((req) => {
        const { type: { type = '', shortType = '' } = {} } = req;
        return type === 'C' && shortType === 'LWP';
      });

    if (key === 4)
      return leaveRequests.filter((req) => {
        const { type: { type = '' } = {} } = req;
        return type === 'D';
      });

    return [];
  };

  renderLoading = () => {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          // padding: '100px 0',
          height: '310px',
        }}
      >
        <Spin size="medium" />
      </div>
    );
  };

  render() {
    const { timeOff: { leaveRequests = [] } = {}, loadingFetchLeaveRequests } = this.props;
    const emptyData = [];
    const leaveRequestsData = this.renderData(leaveRequests, 1);
    const specialRequestsData = this.renderData(leaveRequests, 2);
    const lwpRequestsData = this.renderData(leaveRequests, 3);
    const wfhRequestsData = this.renderData(leaveRequests, 4);
    // const compoffRequestsData = this.renderData(leaveRequests);

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
                <TimeOffRequestTab data={leaveRequestsData} type={1} />
              ) : (
                this.renderLoading()
              )}
            </TabPane>
            <TabPane tab="Special Leave Request" key="2">
              {!loadingFetchLeaveRequests ? (
                <TimeOffRequestTab data={specialRequestsData} type={1} />
              ) : (
                this.renderLoading()
              )}
            </TabPane>
            <TabPane tab="LWP Request" key="3">
              {!loadingFetchLeaveRequests ? (
                <TimeOffRequestTab data={lwpRequestsData} type={1} />
              ) : (
                this.renderLoading()
              )}
            </TabPane>
            <TabPane tab="WFH/CP Requests" key="4">
              {!loadingFetchLeaveRequests ? (
                <TimeOffRequestTab data={wfhRequestsData} type={1} />
              ) : (
                this.renderLoading()
              )}
            </TabPane>
            <TabPane tab="Compoff Request" key="5">
              {!loadingFetchLeaveRequests ? (
                <TimeOffRequestTab data={emptyData} type={2} />
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
