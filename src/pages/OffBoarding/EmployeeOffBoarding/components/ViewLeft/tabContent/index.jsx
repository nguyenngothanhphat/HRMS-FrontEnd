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
    const { data = [], countTable = [] } = this.props;

    return (
      <div>
        <RejectTable setSelectedTab={this.setSelectedTab} totallist={countTable} />
        <div className={styles.tableContainer}>
          <TableEmployee data={data} />
        </div>
      </div>
    );
  }
}

export default TabContent;
