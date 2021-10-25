import React, { Component } from 'react';
import styles from './index.less';
import Summary from '../Summary';
import SearchTable from '../SearchTable';
import TableTickets from '../TableTickets';

// @connect(({ ticketManagement: { totalAll = '' } = {} }) => ({
//   totalAll,
// }))
export class AllTicket extends Component {
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
        const { dispatch, location = [] } = this.props;
        if (prevState.pageSelected !== pageSelected || prevState.size !== size) {
          this.initDataTable(selectedFilterTab);
        }
        if (prevState.selectedFilterTab !== selectedFilterTab) {
          if (selectedFilterTab === '1') {
            dispatch({
              type: 'ticketManagement/fetchListAllTicket',
              payload: {
                status: 'NEW',
                page: 1,
                limit: size,
                location,
              },
            });
          }
          if (selectedFilterTab === '2') {
            dispatch({
              type: 'ticketManagement/fetchListAllTicket',
              payload: {
                status: 'ASSIGNED',
                page: 1,
                limit: size,
                location,
              },
            });
          }
          if (selectedFilterTab === '3') {
            dispatch({
              type: 'ticketManagement/fetchListAllTicket',
              payload: {
                status: 'IN-PROGRESS',
                page: 1,
                limit: size,
                location,
              },
            });
          }
          if (selectedFilterTab === '4') {
            dispatch({
              type: 'ticketManagement/fetchListAllTicket',
              payload: {
                status: 'CLIENT-PENDING',
                page: 1,
                limit: size,
                location,
              },
            });
          }
          if (selectedFilterTab === '5') {
            dispatch({
              type: 'ticketManagement/fetchListAllTicket',
              payload: {
                status: 'RESOLVED',
                page: 1,
                limit: size,
                location,
              },
            });
          };
          if (selectedFilterTab === '6') {
            dispatch({
              type: 'ticketManagement/fetchListAllTicket',
              payload: {
                status: 'CLOSED',
                page: 1,
                limit: size,
                location,
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
              status: 'NEW',  
              page: pageSelected,
              limit: size,
              location,
            },
          });
        }
        if (tabId === '2') {
          dispatch({
            type: 'ticketManagement/fetchListAllTicket',
            payload: {
              status: 'ASSIGNED',
              limit: size,
              location,
            },
          });
        }
        if (tabId === '3') {
          dispatch({
            type: 'ticketManagement/fetchListAllTicket',
            payload: {
              status: 'IN-PROGRESS',
              page: pageSelected,
              limit: size,
              location,
            },
          });
        }
        if (tabId === '4') {
          dispatch({
            type: 'ticketManagement/fetchListAllTicket',
            payload: {
              status: 'CLIENT-PENDING',
              page: pageSelected,
              limit: size,
              location,
            },
          });
        }
        if (tabId === '5') {
          dispatch({
            type: 'ticketManagement/fetchListAllTicket',
            payload: {
              status: 'RESOLVED',
              page: pageSelected,
              limit: size,
              location,
            },
          });
        };
        if (tabId === '6') {
            dispatch({
              type: 'ticketManagement/fetchListAllTicket',
              payload: {
                status: 'CLOSED',
                page: pageSelected,
                limit: size,
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

    getPageAndSize = (page, pageSize) => {
        this.setState({
          pageSelected: page,
          size: pageSize,
        });
    };

    render() {
        const { pageSelected, size } = this.state;
        return (
            <div className={styles.containerTickets}>
                <div className={styles.tabTickets}>
                    <Summary />
                    <SearchTable />
                </div>
                <TableTickets />
            </div>
        )
    }
}

export default AllTicket
