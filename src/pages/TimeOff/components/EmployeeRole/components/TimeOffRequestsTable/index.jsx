import React, { PureComponent } from 'react';
import { Tabs } from 'antd';
import { connect } from 'umi';
import TimeOffRequestTab from './components/TimeOffRequestTab';

import styles from './index.less';

const { TabPane } = Tabs;

const mockData = [
  {
    status: 1, // in-progress
    ticketId: 160012312,
    type: 'CL',
    requestedOn: '19.08.20',
    leaveDate: '22.08.20 - 22.08.20',
    duration: 0.5,
    assigned: [
      {
        userId: 1,
        name: 'Alex',
        imageUrl: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      },
    ],
  },
  {
    status: 2, // on-hold
    ticketId: 160012352,
    type: 'CL',
    requestedOn: '19.08.20',
    leaveDate: '22.08.20 - 22.08.20',
    duration: 2.5,
    assigned: [
      {
        userId: 1,
        name: 'John',
        imageUrl: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      },
      {
        userId: 2,
        name: 'Lewis',
        imageUrl: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      },
      {
        userId: 3,
        name: 'Lewis',
        imageUrl: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      },
    ],
  },
  {
    status: 3, // accepted
    ticketId: 160035253,
    type: 'CL',
    requestedOn: '19.08.20',
    leaveDate: '22.08.20 - 22.08.20',
    duration: 0.5,
    assigned: [
      {
        userId: 1,
        name: 'Alex',
        imageUrl: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      },
    ],
  },
  {
    status: 4, // rejected
    ticketId: 160084654,
    type: 'CL',
    requestedOn: '19.08.20',
    leaveDate: '22.08.20 - 22.08.20',
    duration: 2.5,
    assigned: [
      {
        userId: 1,
        name: 'John',
        imageUrl: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      },
      {
        userId: 2,
        name: 'Lewis',
        imageUrl: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      },
      {
        userId: 3,
        name: 'Lewis',
        imageUrl: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      },
    ],
  },
  {
    status: 3, // accepted
    ticketId: 160067456,
    type: 'CL',
    requestedOn: '19.08.20',
    leaveDate: '22.08.20 - 22.08.20',
    duration: 0.5,
    assigned: [
      {
        userId: 1,
        name: 'Alex',
        imageUrl: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      },
      {
        userId: 6,
        name: 'Alex',
        imageUrl: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      },
    ],
  },
  {
    status: 4, // rejected
    ticketId: 160073534,
    type: 'CL',
    requestedOn: '19.08.20',
    leaveDate: '22.08.20 - 22.08.20',
    duration: 2.5,
    assigned: [
      {
        userId: 1,
        name: 'John',
        imageUrl: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      },
      {
        userId: 2,
        name: 'Lewis',
        imageUrl: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      },
      {
        userId: 3,
        name: 'Lewis',
        imageUrl: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      },
    ],
  },
  {
    status: 1, // in-progress
    ticketId: 160074523,
    type: 'CL',
    requestedOn: '19.08.20',
    leaveDate: '22.08.20 - 22.08.20',
    duration: 0.5,
    assigned: [
      {
        userId: 1,
        name: 'Alex',
        imageUrl: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      },
    ],
  },
  {
    status: 1, // in-progress
    ticketId: 160022322,
    type: 'CL',
    requestedOn: '19.08.20',
    leaveDate: '22.08.20 - 22.08.20',
    duration: 0.5,
    assigned: [
      {
        userId: 1,
        name: 'Alex',
        imageUrl: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      },
      {
        userId: 1,
        name: 'John',
        imageUrl: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      },
    ],
  },
  {
    status: 1, // in-progress
    ticketId: 160074542,
    type: 'CL',
    requestedOn: '19.08.20',
    leaveDate: '22.08.20 - 22.08.20',
    duration: 0.5,
    assigned: [
      {
        userId: 1,
        name: 'Alex',
        imageUrl: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      },
    ],
  },
];

@connect(({ timeOff, loading }) => ({
  loadingFetchLeaveRequests: loading.effects['timeOff/fetchLeaveRequestOfEmployee'],
  timeOff,
}))
class TimeOffRequestsTable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'timeOff/fetchLeaveRequestOfEmployee',
    });
  };

  renderTableTitle = {
    left: (
      <div className={styles.renderTableTitle}>
        <span>Timeoff Requests</span>
      </div>
    ),
  };

  renderData = (data) => {
    return data;
  };

  render() {
    const { timeOff: { leaveRequests = [] } = {}, loadingFetchLeaveRequests } = this.props;
    const emptyData = [];
    const leaveRequestsData = this.renderData(leaveRequests);
    const specialRequestsData = this.renderData(leaveRequests);
    const lwpRequestsData = this.renderData(leaveRequests);
    const compoffRequestsData = this.renderData(leaveRequests);

    return (
      <div className={styles.TimeOffRequestsTable}>
        <Tabs
          tabPosition="left"
          tabBarGutter={40}
          defaultActiveKey="1"
          tabBarExtraContent={this.renderTableTitle}
        >
          <TabPane tab="Leave Request" key="1">
            <TimeOffRequestTab data={leaveRequestsData} />
          </TabPane>
          <TabPane tab="Special Leave Request" key="2">
            <TimeOffRequestTab data={specialRequestsData} />
          </TabPane>
          <TabPane tab="LWP Request" key="3">
            <TimeOffRequestTab data={lwpRequestsData} />
          </TabPane>
          <TabPane tab="WFH/CP Requests" key="4">
            <TimeOffRequestTab data={emptyData} />
          </TabPane>
          <TabPane tab="Compoff Request" key="5">
            <TimeOffRequestTab data={compoffRequestsData} />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default TimeOffRequestsTable;
