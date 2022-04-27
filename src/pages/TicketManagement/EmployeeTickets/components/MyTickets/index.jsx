import React, { Component } from 'react';
import { connect } from 'umi';
import { debounce } from 'lodash';
import styles from './index.less';
import SearchTable from '../../../components/SearchTable';
import TableTickets from '../TableTickets';
import TicketInfo from '../TicketInfo';
import Summary from '../Summary';
import FilterCount from '../../../components/FilterCount/FilterCount';

@connect(
  ({
    loading,
    user: { currentUser: { employee = {} } = {} } = {},
    ticketManagement: { selectedLocations = [] } = {},
  }) => ({
    employee,
    selectedLocations,
    loading: loading.effects['ticketManagement/fetchListAllTicket'],
    loadingFilter: loading.effects['ticketManagement/fetchListAllTicketSearch'],
  }),
)
class MyTickets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFilterTab: '1',
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
    const { selectedFilterTab, pageSelected, size, nameSearch } = this.state;
    const { selectedLocations = [] } = this.props;

    if (
      prevState.pageSelected !== pageSelected ||
      prevState.size !== size ||
      prevState.selectedFilterTab !== selectedFilterTab ||
      prevState.nameSearch !== nameSearch ||
      JSON.stringify(prevProps.selectedLocations) !== JSON.stringify(selectedLocations)
    ) {
      this.initDataTable(selectedFilterTab, nameSearch, selectedLocations);
    }
  }

  getStatus = (selectedTab) => {
    switch (selectedTab) {
      case '1':
        return 'Assigned';
      case '2':
        return 'In Progress';
      case '3':
        return 'Client Pending';
      case '4':
        return 'Resolved';
      case '5':
        return 'Closed';

      default:
        return 'Assigned';
    }
  };

  initDataTable = (tabId, nameSearch, selectedLocations) => {
    const { dispatch } = this.props;
    const { pageSelected, size } = this.state;

    let payload = {
      status: [this.getStatus(tabId)],
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

  handleFilterCounts = (values) => {
    const filteredObj = Object.entries(values).filter(
      ([key, value]) => (value !== undefined && value?.length > 0) || value?.isValid,
    );
    const newObj = Object.fromEntries(filteredObj);
    this.setState({
      applied: Object.keys(newObj).length,
    });
  };

  render() {
    const {
      data = [],
      loading,
      loadingFilter,
      countData = [],
      employee: { _id = '' },
      selectedLocations = [],
    } = this.props;
    const { pageSelected, size, applied, form, selectedFilterTab, nameSearch } = this.state;
    const dataTableEmployee = data.filter((item) => {
      return item.employee_assignee === _id;
    });
    return (
      <>
        <div>
          <TicketInfo countData={countData} />
        </div>
        <div className={styles.containerTickets}>
          <div className={styles.tabTickets}>
            <Summary setSelectedTab={this.setSelectedTab} countData={countData} />
            <FilterCount
              applied={applied}
              form={form}
              setApplied={this.setApplied}
              initDataTable={this.initDataTable}
              selectedFilterTab={selectedFilterTab}
              nameSearch={nameSearch}
              selectedLocations={selectedLocations}
            />
            <SearchTable
              onChangeSearch={this.onChangeSearch}
              handleFilterCounts={this.handleFilterCounts}
              setForm={this.setForm}
            />
          </div>
          <TableTickets
            data={dataTableEmployee}
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

export default MyTickets;
