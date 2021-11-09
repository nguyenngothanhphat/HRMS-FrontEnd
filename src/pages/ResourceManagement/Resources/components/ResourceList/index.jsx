import React, { Component } from 'react';
import { connect } from 'umi';
import styles from './index.less';
import Summary from '../Summary';
import SearchTable from '../SearchTable';
import TableTickets from '../TableResources';

@connect(({ loading = {} }) => ({
  loading: loading.effects['ticketManagement/fetchListAllTicket'],
}))
class ResourceList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFilterTab: '1',
      pageSelected: 1,
      size: 10,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('All ticket init call')
    const { selectedFilterTab, pageSelected, size } = this.state;
    const { dispatch, 
      // location = [] 
    } = this.props;
    if (prevState.pageSelected !== pageSelected || prevState.size !== size) {
      this.initDataTable(selectedFilterTab);
    }
    if (prevState.selectedFilterTab !== selectedFilterTab) {
      if (selectedFilterTab === '1') {
        dispatch({
          type: 'ticketManagement/fetchListAllTicket',
          payload: {
            status: 'New',
            page: 1,
            limit: size,
            // location,
          },
        });
      }
      if (selectedFilterTab === '2') {
        dispatch({
          type: 'ticketManagement/fetchListAllTicket',
          payload: {
            status: 'Assigned',
            page: 1,
            limit: size,
            // location,
          },
        });
      }
      if (selectedFilterTab === '3') {
        dispatch({
          type: 'ticketManagement/fetchListAllTicket',
          payload: {
            status: 'In Progress',
            page: 1,
            limit: size,
            // location,
          },
        });
      }
      if (selectedFilterTab === '4') {
        dispatch({
          type: 'ticketManagement/fetchListAllTicket',
          payload: {
            status: 'Client Pending',
            page: 1,
            limit: size,
            // location,
          },
        });
      }
      if (selectedFilterTab === '5') {
        dispatch({
          type: 'ticketManagement/fetchListAllTicket',
          payload: {
            status: 'Resolved',
            page: 1,
            limit: size,
            // location,
          },
        });
      }
      if (selectedFilterTab === '6') {
        dispatch({
          type: 'ticketManagement/fetchListAllTicket',
          payload: {
            status: 'Closed',
            page: 1,
            limit: size,
            // location,
          },
        });
      }
    }
  }

  initDataTable = (tabId) => {
    const { dispatch, location } = this.props;
    const { pageSelected, size } = this.state;
    if (tabId === '1') {
      dispatch({
        type: 'ticketManagement/fetchListAllTicket',
        payload: {
          status: 'New',
          page: pageSelected,
          limit: size,
          // location,
        },
      });
    }
    // if (tabId === '2') {
    //   dispatch({
    //     type: 'ticketManagement/fetchListAllTicket',
    //     payload: {
    //       status: 'Assigned',
    //       limit: size,
    //       // location,
    //     },
    //   });
    // }
    // if (tabId === '3') {
    //   dispatch({
    //     type: 'ticketManagement/fetchListAllTicket',
    //     payload: {
    //       status: 'In Progress',
    //       page: pageSelected,
    //       limit: size,
    //       // location,
    //     },
    //   });
    // }
    // if (tabId === '4') {
    //   dispatch({
    //     type: 'ticketManagement/fetchListAllTicket',
    //     payload: {
    //       status: 'Client Pending',
    //       page: pageSelected,
    //       limit: size,
    //       // location,
    //     },
    //   });
    // }
    // if (tabId === '5') {
    //   dispatch({
    //     type: 'ticketManagement/fetchListAllTicket',
    //     payload: {
    //       status: 'Resolved',
    //       page: pageSelected,
    //       limit: size,
    //       // location,
    //     },
    //   });
    // }
    // if (tabId === '6') {
    //   dispatch({
    //     type: 'ticketManagement/fetchListAllTicket',
    //     payload: {
    //       status: 'Closed',
    //       page: pageSelected,
    //       limit: size,
    //       // location,
    //     },
    //   });
    // }
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
    const { data = [], loading, loadingSearch, countData = [] } = this.props;
    const { pageSelected, size } = this.state;
    return (
      <div className={styles.containerTickets}>
        <div className={styles.tabTickets}>
          <Summary setSelectedTab={this.setSelectedTab} countData={countData} />
          <SearchTable />
        </div>
        <TableTickets
          data={data}
          loading={loading || loadingSearch}
          pageSelected={pageSelected}
          size={size}
          getPageAndSize={this.getPageAndSize}
        />
      </div>
    );
  }
}

export default ResourceList;
