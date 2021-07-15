import React, { Component, Fragment } from 'react';
import { connect } from 'umi';
import TableManager from '../TableManager';
import Summary from '../Summary';

@connect(({ loading, offboarding: { totalAll = 0 } = {} }) => ({
  loading: loading.effects['offboarding/fetchListTeamRequest'],
  totalAll,
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
    const { dispatch } = this.props;
    if (tabId === '1') {
      dispatch({
        type: 'offboarding/fetchListTeamRequest',
      });
    }
    if (tabId === '2') {
      dispatch({
        type: 'offboarding/fetchListTeamRequest',
        payload: {
          status: 'IN-PROGRESS',
        },
      });
    }
    if (tabId === '3') {
      dispatch({
        type: 'offboarding/fetchListTeamRequest',
        payload: {
          status: 'ON-HOLD',
        },
      });
    }
    if (tabId === '4') {
      dispatch({
        type: 'offboarding/fetchListTeamRequest',
        payload: {
          status: 'ACCEPTED',
        },
      });
    }
    if (tabId === '5') {
      dispatch({
        type: 'offboarding/fetchListTeamRequest',
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
    const {
      data = [],
      countdata = [],
      loading,
      hrManager = {},
      loadingSearch,
      totalAll,
      timezoneList,
    } = this.props;

    return (
      <>
        <Summary totalAll={totalAll} setSelectedTab={this.setSelectedTab} countdata={countdata} />
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
