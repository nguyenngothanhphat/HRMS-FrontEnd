import React, { Component, Fragment } from 'react';
import { connect } from 'umi';
import TableManager from '../TableManager';
import Summary from '../Summary';

@connect(({ loading }) => ({
  loading: loading.effects['offboarding/fetchListTeamRequest'],
}))
class TeamRequest extends Component {
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
    const { dispatch, location } = this.props;
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

  setSelectedTab = (id) => {
    this.setState({
      selectedFilterTab: id,
    });
  };

  render() {
    const {
      data = [],
      countdata = [],
      loading,
      hrManager = {},
      loadingSearch,
      timezoneList,
    } = this.props;

    return (
      <>
        <Summary setSelectedTab={this.setSelectedTab} countdata={countdata} />
        <TableManager
          data={data}
          timezoneList={timezoneList}
          loading={loading || loadingSearch}
          hrManager={hrManager}
        />
      </>
    );
  }
}

export default TeamRequest;
