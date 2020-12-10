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

  componentDidMount = () => {
    const {
      dispatch,
      user: { currentUser: { employee: { _id = '' } = {} } = {} } = {},
    } = this.props;

    dispatch({
      type: 'timeOff/fetchLeaveRequestOfEmployee',
      employee: _id,
    });
  };

  renderTableTitle = {
    left: (
      <div className={styles.renderTableTitle}>
        <span>Timeoff Requests</span>
      </div>
    ),
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
        const { type: { type = '', shortType = '' } = {} } = req;
        return type === 'D';
      });

    return [];
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
        {loadingFetchLeaveRequests && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              padding: '100px 0',
            }}
          >
            <Spin size="medium" />
          </div>
        )}
        {!loadingFetchLeaveRequests && (
          <Tabs
            tabPosition="left"
            tabBarGutter={40}
            defaultActiveKey="1"
            tabBarExtraContent={this.renderTableTitle}
          >
            <>
              <TabPane tab="Leave Request" key="1">
                <TimeOffRequestTab data={leaveRequestsData} type={1} />
              </TabPane>
              <TabPane tab="Special Leave Request" key="2">
                <TimeOffRequestTab data={specialRequestsData} type={1} />
              </TabPane>
              <TabPane tab="LWP Request" key="3">
                <TimeOffRequestTab data={lwpRequestsData} type={1} />
              </TabPane>
              <TabPane tab="WFH/CP Requests" key="4">
                <TimeOffRequestTab data={wfhRequestsData} type={1} />
              </TabPane>
              <TabPane tab="Compoff Request" key="5">
                <TimeOffRequestTab data={emptyData} type={2} />
              </TabPane>
            </>
          </Tabs>
        )}
      </div>
    );
  }
}

export default TimeOffRequestsTable;
