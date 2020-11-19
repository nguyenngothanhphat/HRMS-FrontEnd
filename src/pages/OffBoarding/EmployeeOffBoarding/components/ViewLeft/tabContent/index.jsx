import React, { Component } from 'react';
import { connect } from 'umi';
import TableEmployee from '../TableEmployee';
import RejectTable from '../RejectTable';
import styles from './index.less';

@connect()
class TabContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFilterTab: '1',
    };
  }

  componentDidMount() {
    this.initDataTable('1');
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { selectedFilterTab } = this.state;
    const { selectedFilterTab: nextTabId } = nextState;
    if (selectedFilterTab !== nextTabId) {
      this.initDataTable(nextTabId);
    }
    return true;
  }

  initDataTable = (tabId) => {
    const { dispatch } = this.props;
    if (tabId === '1') {
      dispatch({
        type: 'offboarding/fetchList',
        payload: {
          status: 'IN-PROGRESS',
        },
      });
    }
    if (tabId === '2') {
      dispatch({
        type: 'offboarding/fetchList',
        payload: {
          status: 'ON-HOLD',
        },
      });
    }
    if (tabId === '3') {
      dispatch({
        type: 'offboarding/fetchList',
        payload: {
          status: 'ACCEPTED',
        },
      });
    }
    if (tabId === '4') {
      dispatch({
        type: 'offboarding/fetchList',
        payload: {
          status: 'REJECTED',
        },
      });
    }
  };

  setSelectedTab = (id) => {
    this.setState({
      selectedFilterTab: id,
    });
  };

  render() {
    const { selectedFilterTab } = this.state;
    const { data = [] } = this.props;
    const length = data.length || 0;

    return (
      <div>
        <RejectTable setSelectedTab={this.setSelectedTab} lengthData={length} />
        <div className={styles.tableContainer}>
          {selectedFilterTab === '1' ? <TableEmployee data={data} /> : ''}
          {selectedFilterTab === '2' ? <TableEmployee data={data} /> : ''}
          {selectedFilterTab === '3' ? <TableEmployee data={data} /> : ''}
          {selectedFilterTab === '4' ? <TableEmployee data={data} /> : ''}
        </div>
      </div>
    );
  }
}

export default TabContent;
