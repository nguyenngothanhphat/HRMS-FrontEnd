import React, { PureComponent } from 'react';
import FilterBar from '../FilterBar';
import LRTable from './components/LRTable';
import styles from './index.less';

const data = [
  {
    ticketId: 1,
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
    ticketId: 2,
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
    ],
  },
];
export default class LeaveRequestTab extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedFilterTab: '1',
    };
  }

  setSelectedFilterTab = (id) => {
    this.setState({
      selectedFilterTab: id,
    });
  };

  render() {
    const { selectedFilterTab } = this.state;

    return (
      <div className={styles.LeaveRequestTab}>
        <FilterBar setSelectedFilterTab={this.setSelectedFilterTab} />
        <div className={styles.tableContainer}>
          {selectedFilterTab === '1' ? <LRTable data={data} /> : ''}
          {selectedFilterTab === '2' ? <LRTable data={data} /> : ''}
          {selectedFilterTab === '3' ? <LRTable data={data} /> : ''}
          {selectedFilterTab === '4' ? <LRTable data={data} /> : ''}
        </div>
      </div>
    );
  }
}
