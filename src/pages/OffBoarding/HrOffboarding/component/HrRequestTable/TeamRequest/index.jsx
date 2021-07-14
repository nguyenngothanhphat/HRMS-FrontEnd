import React, { Component, Fragment } from 'react';
import { connect } from 'umi';
import HrTable from '../TableHRManager';
import Summary from '../Summary';

@connect(({ loading, offboarding: { totalAll = 0 } = {} }) => ({
  loading: loading.effects['offboarding/fetchListTeamRequest'],
  totalAll,
}))
class TabContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFilterTab: '1',
    };
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
    const { dispatch, location = [] } = this.props;
    if (tabId === '1') {
      dispatch({
        type: 'offboarding/fetchListTeamRequest',
        payload: {
          location,
        },
      });
    }
    if (tabId === '2') {
      dispatch({
        type: 'offboarding/fetchListTeamRequest',
        payload: {
          status: 'IN-PROGRESS',
          location,
        },
      });
    }
    if (tabId === '3') {
      dispatch({
        type: 'offboarding/fetchListTeamRequest',
        payload: {
          status: 'ON-HOLD',
          location,
        },
      });
    }
    if (tabId === '4') {
      dispatch({
        type: 'offboarding/fetchListTeamRequest',
        payload: {
          status: 'ACCEPTED',
          location,
        },
      });
    }
    if (tabId === '5') {
      dispatch({
        type: 'offboarding/fetchListTeamRequest',
        payload: {
          status: 'REJECTED',
          location,
        },
      });
    }
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

  render() {
    const {
      data = [],
      countdata,
      loading,
      hrManager = {},
      loadingSearch,
      timezoneList,
      totalAll,
    } = this.props;
    const { selectedFilterTab = '1' } = this.state;
    const isTabAccept = selectedFilterTab === '3';
    const isTabAll = selectedFilterTab === '1';
    return (
      <>
        <Summary totalAll={totalAll} setSelectedTab={this.setSelectedTab} countdata={countdata} />
        <HrTable
          data={data}
          loading={loading || loadingSearch}
          isTabAll={isTabAll}
          isTabAccept={isTabAccept}
          moveToRelieving={this.moveToRelieving}
          hrManager={hrManager}
          timezoneList={timezoneList}
        />
      </>
    );
  }
}

export default TabContent;
