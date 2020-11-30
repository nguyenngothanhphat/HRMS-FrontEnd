import React, { PureComponent } from 'react';
import { Tabs } from 'antd';
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

export default class TimeOffRequests extends PureComponent {
  renderTableTitle = {
    left: (
      <div className={styles.renderTableTitle}>
        <span>Timeoff Requests</span>
      </div>
    ),
  };

  render() {
    const emptyData = [];
    return (
      <div className={styles.TimeOffRequests}>
        <Tabs
          tabPosition="left"
          tabBarGutter={40}
          defaultActiveKey="1"
          tabBarExtraContent={this.renderTableTitle}
        >
          <TabPane tab="Leave Request" key="1">
            <TimeOffRequestTab data={emptyData} />
          </TabPane>
          <TabPane tab="Special Leave Request" key="2">
            <TimeOffRequestTab data={mockData} />
          </TabPane>
          <TabPane tab="LWP Request" key="3">
            <TimeOffRequestTab data={mockData} />
          </TabPane>
          <TabPane tab=" WFH/CP Requests" key="4">
            <TimeOffRequestTab data={emptyData} />
          </TabPane>
          <TabPane tab="Compoff Request" key="5">
            <TimeOffRequestTab data={mockData} />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
