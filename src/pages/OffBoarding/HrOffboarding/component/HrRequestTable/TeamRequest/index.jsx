import React, { Component, Fragment } from 'react';
import { connect } from 'umi';
import HrTable from '../TableHRManager';
import Summary from '../Summary';

@connect(({ loading, offboarding: { list } = {} }) => ({
  loading: loading.effects['offboarding/fetchListTeamRequest'],
  loadingAll: loading.effects['offboarding/fetchListAllRequest'],
}))
class TabContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFilterTab: '1',
      pageSelected: 1,
      size: 10,
      tabId: 1,
    };
  }

  componentDidMount() {
    const { pageSelected, size } = this.state;
    const { dispatch, location = [] } = this.props;
    console.log('adsfadsf');
    dispatch({
      type: 'offboarding/fetchListAllRequest',
      payload: {
        // status: ['IN-PROGRESS', 'ON-HOLD', 'ACCEPTED', 'REJECTED'],
        location,
        page: pageSelected,
        limit: size,
      },
    });
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   const { selectedFilterTab } = this.state;
  //   const { selectedFilterTab: nextTabId } = nextState;
  //   if (selectedFilterTab !== nextTabId) {
  //     this.initDataTable(nextTabId);
  //   }
  //   return true;
  // }

  initDataTable = (tabId) => {
    const { dispatch, location = [] } = this.props;
    const { pageSelected, size } = this.state;
    if (tabId === '1') {
      dispatch({
        type: 'offboarding/fetchListAllRequest',
        payload: {
          // status: ['IN-PROGRESS', 'ON-HOLD', 'ACCEPTED', 'REJECTED'],
          location,
          page: pageSelected,
          limit: size,
        },
      });
    }
    if (tabId === '2') {
      dispatch({
        type: 'offboarding/fetchListTeamRequest',
        payload: {
          status: 'IN-PROGRESS',
          location,
          page: pageSelected,
          limit: size,
        },
      });
    }
    if (tabId === '3') {
      dispatch({
        type: 'offboarding/fetchListTeamRequest',
        payload: {
          status: 'ON-HOLD',
          location,
          page: pageSelected,
          limit: size,
        },
      });
    }
    if (tabId === '4') {
      dispatch({
        type: 'offboarding/fetchListTeamRequest',
        payload: {
          status: 'ACCEPTED',
          location,
          page: pageSelected,
          limit: size,
        },
      });
    }
    if (tabId === '5') {
      dispatch({
        type: 'offboarding/fetchListTeamRequest',
        payload: {
          status: 'REJECTED',
          location,
          page: pageSelected,
          limit: size,
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

  moveToRelieving = (payload) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'offboarding/updateRelieving',
      payload,
    });
  };

  setSelectedTab = (id) => {
    this.setState({
      selectedFilterTab: id,
    });
  };

  getPageAndSize = (page, pageSize) => {
    this.setState({
      pageSelected: page,
      size: pageSize,
    });
  };

  render() {
    const {
      data = [],
      dataAll = [],
      countdata,
      loading,
      loadingAll,
      hrManager = {},
      // loadingSearch,
      timezoneList,
      total = '',
    } = this.props;
    const { selectedFilterTab = '1', pageSelected, size } = this.state;
    const isTabAccept = selectedFilterTab === '3';
    const isTabAll = selectedFilterTab === '1';
    return (
      <>
        <Summary setSelectedTab={this.setSelectedTab} countdata={countdata} />
        <HrTable
          data={data}
          dataAll={dataAll}
          // loading={loadingAll || loading |}
          isTabAll={isTabAll}
          isTabAccept={isTabAccept}
          moveToRelieving={this.moveToRelieving}
          hrManager={hrManager}
          timezoneList={timezoneList}
          pageSelected={pageSelected}
          size={size}
          getPageAndSize={this.getPageAndSize}
          total={total}
        />
      </>
    );
  }
}

export default TabContent;
