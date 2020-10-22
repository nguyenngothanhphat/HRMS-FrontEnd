import React, { PureComponent } from 'react';
import TableEmployee from '../TableEmployee';
import RejectTable from '../RejectTable';
import styles from './index.less';

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
    const { data = [] } = this.props;
    return (
      <div>
        <RejectTable setSelectedTab={this.setSelectedTab} />
        <div className={styles.tableContainer}>
          {selectedFilterTab === '1' ? <TableEmployee data={data} /> : ''}
          {selectedFilterTab === '2' ? <TableEmployee /> : ''}
          {selectedFilterTab === '3' ? <TableEmployee /> : ''}
          {selectedFilterTab === '4' ? <TableEmployee /> : ''}
        </div>
      </div>
    );
  }
}
