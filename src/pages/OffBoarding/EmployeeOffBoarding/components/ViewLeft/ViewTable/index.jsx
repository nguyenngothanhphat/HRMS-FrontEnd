import React, { Component, Fragment } from 'react';
import { connect } from 'umi';
import TableEmployee from '../TableEmployee';
// import Summary from '../Summary';

@connect(({ offboarding: { totalAll = '' } = {} }) => ({ totalAll }))
class ViewTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFilterTab: '1',
      pageSelected: 1,
      size: 10,
    };
  }

  componentDidMount() {
    this.initDataTable('1');
  }

  componentDidUpdate(prevProps, prevState) {
    const { selectedFilterTab, pageSelected, size } = this.state;
    const { dispatch } = this.props;
    if (prevState.pageSelected !== pageSelected || prevState.size !== size) {
      this.initDataTable(selectedFilterTab);
    }
    if (prevState.selectedFilterTab !== selectedFilterTab) {
      if (selectedFilterTab === '1') {
        dispatch({
          type: 'offboarding/fetchList',
          payload: {
            status: 'IN-PROGRESS',
            page: 1,
            limit: size,
          },
        });
      }
      if (selectedFilterTab === '2') {
        dispatch({
          type: 'offboarding/fetchList',
          payload: {
            status: 'ON-HOLD',
            page: 1,
            limit: size,
          },
        });
      }
      if (selectedFilterTab === '3') {
        dispatch({
          type: 'offboarding/fetchList',
          payload: {
            status: 'ACCEPTED',
            page: 1,
            limit: size,
          },
        });
      }
      if (selectedFilterTab === '4') {
        dispatch({
          type: 'offboarding/fetchList',
          payload: {
            status: 'REJECTED',
            page: 1,
            limit: size,
          },
        });
      }
      if (selectedFilterTab === '5') {
        dispatch({
          type: 'offboarding/fetchList',
          payload: {
            status: 'WITHDRAW',
            page: 1,
            limit: size,
          },
        });
      }
    }
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

  getPageAndSize = (page, pageSize) => {
    this.setState({
      pageSelected: page,
      size: pageSize,
    });
  };

  setSelectedTab = (id) => {
    this.setState({
      selectedFilterTab: id,
    });
  };

  render() {
    const {
      data = [],
      countTable = [],
      hrManager = {},
      tabId,
      fetchData = () => {},
      totalAll = '',
    } = this.props;
    const { pageSelected, size } = this.state;

    return (
      <>
        {/* <Summary setSelectedTab={this.setSelectedTab} totallist={countTable} /> */}
        <TableEmployee
          fetchData={fetchData}
          data={data}
          hrManager={hrManager}
          tabId={tabId}
          pageSelected={pageSelected}
          size={size}
          total={totalAll}
          getPageAndSize={this.getPageAndSize}
        />
      </>
    );
  }
}

export default ViewTable;
