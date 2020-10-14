import React, { PureComponent } from 'react';
import FilterBar from '../FilterBar';
import LRTable from './LRTable';
import styles from './index.less';

const data = [
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
export default class LeaveRequestTab extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedFilterTab: '1',
      inProgressData: [],
      onHoldData: [],
      acceptedData: [],
      rejectedData: [],
    };
  }

  componentDidMount = () => {
    this.progressData(data);
  };

  setSelectedFilterTab = (id) => {
    this.setState({
      selectedFilterTab: id,
    });
  };

  progressData = (originalData) => {
    const inProgressData = [];
    const onHoldData = [];
    const acceptedData = [];
    const rejectedData = [];

    originalData.forEach((row) => {
      switch (row.status) {
        case 1: {
          inProgressData.push(row);
          break;
        }
        case 2: {
          onHoldData.push(row);
          break;
        }
        case 3: {
          acceptedData.push(row);
          break;
        }
        case 4: {
          rejectedData.push(row);
          break;
        }
        default:
          break;
      }
    });
    this.setState({
      inProgressData,
      onHoldData,
      acceptedData,
      rejectedData,
    });
  };

  render() {
    const {
      selectedFilterTab,
      inProgressData,
      onHoldData,
      acceptedData,
      rejectedData,
    } = this.state;

    const dataNumber = {
      inProgressNumber: inProgressData.length,
      onHoldNumber: onHoldData.length,
      acceptedNumber: acceptedData.length,
      rejectedNumber: rejectedData.length,
    };
    return (
      <div className={styles.LeaveRequestTab}>
        <FilterBar dataNumber={dataNumber} setSelectedFilterTab={this.setSelectedFilterTab} />
        <div className={styles.tableContainer}>
          {selectedFilterTab === '1' ? <LRTable data={inProgressData} /> : ''}
          {selectedFilterTab === '2' ? <LRTable data={onHoldData} /> : ''}
          {selectedFilterTab === '3' ? <LRTable data={acceptedData} /> : ''}
          {selectedFilterTab === '4' ? <LRTable data={rejectedData} /> : ''}
        </div>
      </div>
    );
  }
}
