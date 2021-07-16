import React, { Component, Fragment } from 'react';
import { connect } from 'umi';
import TableManager from '../TableManager';
import Summary from '../Summary';

@connect(({ loading, offboarding: { totalAll = '' } = {} }) => ({
  loading: loading.effects['offboarding/fetchListTeamRequest'],
  totalAll,
}))
class TeamRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFilterTab: '1',
      pageSelected: 1,
      size: 10,
    };
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
          type: 'offboarding/fetchListTeamRequest',
          payload: {
            page: 1,
            limit: size,
          },
        });
      }
      if (selectedFilterTab === '2') {
        dispatch({
          type: 'offboarding/fetchListTeamRequest',
          payload: {
            status: 'IN-PROGRESS',
            page: 1,
            limit: size,
          },
        });
      }
      if (selectedFilterTab === '3') {
        dispatch({
          type: 'offboarding/fetchListTeamRequest',
          payload: {
            status: 'ON-HOLD',
            page: 1,
            limit: size,
          },
        });
      }
      if (selectedFilterTab === '4') {
        dispatch({
          type: 'offboarding/fetchListTeamRequest',
          payload: {
            status: 'ACCEPTED',
            page: 1,
            limit: size,
          },
        });
      }
      if (selectedFilterTab === '5') {
        dispatch({
          type: 'offboarding/fetchListTeamRequest',
          payload: {
            status: 'REJECTED',
            page: 1,
            limit: size,
          },
        });
      }
    }
  }

  initDataTable = (tabId) => {
    const { dispatch } = this.props;
    const { pageSelected, size } = this.state;

    if (tabId === '1') {
      dispatch({
        type: 'offboarding/fetchListTeamRequest',
        payload: {
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
          page: pageSelected,
          limit: size,
        },
      });
    }
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
      countdata = [],
      loading,
      hrManager = {},
      loadingSearch,
      timezoneList,
      totalAll = '',
    } = this.props;
    const { pageSelected, size } = this.state;

    return (
      <>
        <Summary setSelectedTab={this.setSelectedTab} countdata={countdata} />
        <TableManager
          data={data}
          timezoneList={timezoneList}
          loading={loading || loadingSearch}
          hrManager={hrManager}
          pageSelected={pageSelected}
          size={size}
          total={totalAll}
          getPageAndSize={this.getPageAndSize}
        />
      </>
    );
  }
}

export default TeamRequest;
