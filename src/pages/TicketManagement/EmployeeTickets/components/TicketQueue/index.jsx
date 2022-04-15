import React, { Component } from 'react';

import { connect } from 'umi';
import { debounce } from 'lodash';

import SearchTable from '../../../components/SearchTable';
import TableTickets from '../TableTickets';
import TicketInfo from '../TicketInfo';

import styles from './index.less';

@connect(
  ({
    loading,
    ticketManagement: { listDepartment = [] } = {},
    user: { currentUser: { employee = {} } = {} } = {},
  }) => ({
    listDepartment,
    employee,
    loading: loading.effects['ticketManagement/fetchListAllTicket'],
    loadingFilter: loading.effects['ticketManagement/fetchListAllTicketSearch'],
  }),
)
class TicketQueue extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
      status: ['New'],
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
    const {
      data = [],
      loading,
      loadingFilter,
      countData = [],
      employee: { departmentInfo: { _id = '' } = {} } = [],
    } = this.props;
    const dataTableDeparment = data.filter((item) => {
      return item.department_assign === _id;
    });
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
            data={dataTableDeparment}
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
