import React, { Component } from 'react';
import { connect } from 'umi';
import { debounce } from 'lodash';
import styles from './index.less';
import Summary from '../Summary';
import SearchTable from '../../../components/SearchTable';
import TableTickets from '../TableTickets';

@connect(({ loading = {} }) => ({
  loading: loading.effects['ticketManagement/fetchListAllTicket'],
  loadingFilter: loading.effects['ticketManagement/fetchListAllTicketSearch'],
}))
class AllTicket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFilterTab: '1',
      pageSelected: 1,
      size: 10,
      nameSearch: '',
    };

    this.setDebounce = debounce((nameSearch) => {
      this.setState({
        nameSearch,
      });
    }, 1000);
  }

  componentDidUpdate(prevProps, prevState) {
    const { selectedFilterTab, pageSelected, size, nameSearch } = this.state;

    if (
      prevState.pageSelected !== pageSelected ||
      prevState.size !== size ||
      prevState.selectedFilterTab !== selectedFilterTab ||
      prevState.nameSearch !== nameSearch
    ) {
      this.initDataTable(selectedFilterTab, nameSearch);
    }
  }

  getStatus = (selectedTab) => {
    switch (selectedTab) {
      case '1':
        return 'New';
      case '2':
        return 'Assigned';
      case '3':
        return 'In Progress';
      case '4':
        return 'Client Pending';
      case '5':
        return 'Resolved';
      case '6':
        return 'Closed';

      default:
        return 'New';
    }
  };

  initDataTable = (tabId, nameSearch) => {
    const { dispatch } = this.props;
    const { pageSelected, size } = this.state;

    let payload = {
      status: [this.getStatus(tabId)],
      page: pageSelected,
      limit: size,
    };
    if (nameSearch) {
      payload = {
        ...payload,
        search: nameSearch,
      };
    }
    dispatch({
      type: 'ticketManagement/fetchListAllTicket',
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

  onChangeSearch = (value) => {
    const formatValue = value.toLowerCase();
    this.setDebounce(formatValue);
  };

  render() {
    const { data = [], loading, loadingFilter, countData = [] } = this.props;
    const { pageSelected, size } = this.state;
    return (
      <div className={styles.containerTickets}>
        <div className={styles.tabTickets}>
          <Summary setSelectedTab={this.setSelectedTab} countData={countData} />
          <SearchTable onChangeSearch={this.onChangeSearch} className={styles.searchTable} />
        </div>
        <TableTickets
          data={data}
          loading={loading || loadingFilter}
          pageSelected={pageSelected}
          size={size}
          getPageAndSize={this.getPageAndSize}
        />
      </div>
    );
  }
}

export default AllTicket;
