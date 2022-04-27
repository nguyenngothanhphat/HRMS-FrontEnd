import React, { Component } from 'react';

import { connect } from 'umi';
import { debounce } from 'lodash';

import SearchTable from '../../../components/SearchTable';
import TableTickets from '../TableTickets';
import TicketInfo from '../TicketInfo';

import styles from './index.less';
import FilterCount from '../../../components/FilterCount/FilterCount';

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
      applied: 0,
      form: '',
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

  handleFilterCounts = (values) => {
    const filteredObj = Object.entries(values).filter(
      ([key, value]) => (value !== undefined && value.length > 0) || value?.isValid,
    );
    const newObj = Object.fromEntries(filteredObj);
    this.setState({
      applied: Object.keys(newObj).length,
    });
  };

  setForm = (form) => {
    this.setState({
      form,
    });
  };

  setApplied = () => {
    this.setState({
      applied: 0,
    });
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
    const { pageSelected, size, form, applied } = this.state;
    return (
      <>
        <div>
          <TicketInfo countData={countData} />
        </div>
        <div className={styles.containerTickets}>
          <div className={styles.tabTickets}>
            <FilterCount applied={applied} form={form} setApplied={this.setApplied} />
            <SearchTable
              onChangeSearch={this.onChangeSearch}
              handleFilterCounts={this.handleFilterCounts}
              setForm={this.setForm}
            />
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
