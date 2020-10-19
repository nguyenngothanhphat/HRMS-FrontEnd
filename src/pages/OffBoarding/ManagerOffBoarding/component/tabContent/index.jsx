import React, { PureComponent } from 'react';
import TableEmployee from '../TableManager';
import RejectTable from '../RejectTable';
import styles from './index.less';

const Data = [
  {
    ticketId: 8097,
    employeeId: 'PSI 2090',
    createDate: 'Aug-7,20',
    name: 'Vamsi Venkat Krishna A..',
    currentProject: 'Vodafone Idea',
    projectManager: ' Rose Mar y Mali',
    date: 'Oct-20, 20',
  },
  {
    ticketId: 8098,
    employeeId: 'PSI 2090',
    createDate: 'Aug-7,20',
    name: 'Vamsi Venkat Krishna A..',
    currentProject: 'Vodafone Idea',
    projectManager: ' Rose Mar y Mali',
    date: 'Oct-20, 20',
  },
  {
    ticketId: 8099,
    employeeId: 'PSI 2090',
    createDate: 'Aug-7,20',
    name: 'Vamsi Venkat Krishna A..',
    currentProject: 'Vodafone Idea',
    projectManager: ' Rose Mar y Mali',
    date: 'Oct-20, 20',
  },
  {
    ticketId: 8897,
    employeeId: 'PSI 2090',
    createDate: 'Aug-7,20',
    name: 'Vamsi Venkat Krishna A..',
    currentProject: 'Vodafone Idea',
    projectManager: ' Rose Mar y Mali',
    date: 'Oct-20, 20',
  },
  {
    ticketId: 8797,
    employeeId: 'PSI 2090',
    createDate: 'Aug-7,20',
    name: 'Vamsi Venkat Krishna A..',
    currentProject: 'Vodafone Idea',
    projectManager: ' Rose Mar y Mali',
    date: 'Oct-20, 20',
  },
];

export default class TabContent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedFilterTab: '1',
    };
  }

  setSelectedTab = (id) => {
    this.setState({
      selectedFilterTab: id,
    });
  };

  render() {
    const { selectedFilterTab } = this.state;

    return (
      <div>
        <RejectTable setSelectedTab={this.setSelectedTab} />
        <div className={styles.tableContainer}>
          {selectedFilterTab === '1' ? <TableEmployee data={Data} /> : ''}
          {selectedFilterTab === '2' ? <TableEmployee /> : ''}
          {selectedFilterTab === '3' ? <TableEmployee /> : ''}
          {selectedFilterTab === '4' ? <TableEmployee /> : ''}
        </div>
      </div>
    );
  }
}
