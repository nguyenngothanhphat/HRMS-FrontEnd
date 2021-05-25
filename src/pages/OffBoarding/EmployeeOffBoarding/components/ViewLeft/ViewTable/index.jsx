import React, { Component, Fragment } from 'react';
import { connect } from 'umi';
import TableEmployee from '../TableEmployee';
// import Summary from '../Summary';

@connect()
class ViewTable extends Component {
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
    if (tabId === '5') {
      dispatch({
        type: 'offboarding/fetchList',
        payload: {
          status: 'WITHDRAW',
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
    const { data = [], countTable = [], hrManager = {}, tabId, fetchData = () => {} } = this.props;
    return (
      <>
        {/* <Summary setSelectedTab={this.setSelectedTab} totallist={countTable} /> */}
        <TableEmployee fetchData={fetchData} data={data} hrManager={hrManager} tabId={tabId} />
      </>
    );
  }
}

export default ViewTable;
