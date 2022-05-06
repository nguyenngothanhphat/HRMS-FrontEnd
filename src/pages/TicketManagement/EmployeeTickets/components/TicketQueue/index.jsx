import React, { Component } from 'react';

import { connect } from 'umi';
import { debounce } from 'lodash';

import SearchTable from '../../../components/SearchTable';
import TableTickets from '../TableTickets';
import styles from './index.less';
import TicketInQueue from '../TicketInQueue';

@connect(
  ({
    loading,
    ticketManagement: { listDepartment = [], selectedLocations = [] } = {},
    user: { currentUser: { employee = {} } = {} } = {},
  }) => ({
    listDepartment,
    employee,
    selectedLocations,
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
    const { selectedLocations = [] } = this.props;
    if (
      prevState.pageSelected !== pageSelected ||
      prevState.size !== size ||
      prevState.nameSearch !== nameSearch ||
      JSON.stringify(prevProps.selectedLocations) !== JSON.stringify(selectedLocations)
    ) {
      this.initDataTable(nameSearch, selectedLocations);
    }
  }

  initDataTable = (nameSearch, selectedLocations = []) => {
    const { dispatch } = this.props;
    const { pageSelected, size } = this.state;

    let payload = {
      status: ['New'],
      page: pageSelected,
      limit: size,
      location: selectedLocations,
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
          <TicketInQueue countData={countData} />
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
