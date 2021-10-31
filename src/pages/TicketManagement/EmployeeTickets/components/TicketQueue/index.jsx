import React, { Component } from 'react';
import { connect } from 'umi';
import { debounce } from 'lodash';
import styles from './index.less';
import SearchTable from '../SearchTable';
import TableTickets from '../TableTickets';
import TicketInfo from '../TicketInfo';

@connect(({ loading = {} }) => ({
  loading: loading.effects['ticketManagement/fetchListAllTicket'],
  loadingFilter: loading.effects['ticketManagement/fetchListAllTicketSearch'],
}))
class TicketQueue extends Component {
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
    }, 500);
  }

  componentDidUpdate(prevProps, prevState) {
    const { pageSelected, size, nameSearch } = this.state;

    if (
      prevState.pageSelected !== pageSelected ||
      prevState.size !== size ||
      prevState.nameSearch !== nameSearch
    ) {
      this.initDataTable(nameSearch);
    }
  }

  initDataTable = (nameSearch) => {
    const { dispatch } = this.props;
    const { pageSelected, size } = this.state;

    let payload = {
      status: 'New',
      page: pageSelected,
      limit: size,
    };
    if (nameSearch) {
      payload = {
        ...payload,
        name: nameSearch,
      };
    }
    dispatch({
      type: 'ticketManagement/fetchListAllTicket',
      payload,
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
      <>
        <div>
          <TicketInfo countData={countData} />
        </div>
        <div className={styles.containerTickets}>
          <div className={styles.tabTickets}>
            <SearchTable onChangeSearch={this.onChangeSearch} />
          </div>
          <TableTickets
            data={data}
            loading={loading || loadingFilter}
            pageSelected={pageSelected}
            size={size}
            getPageAndSize={this.getPageAndSize}
          />
        </div>
      </>
    );
  }
}

export default TicketQueue;
