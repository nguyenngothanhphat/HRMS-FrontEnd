import React, { Component } from 'react';
import { connect } from 'umi';
import { debounce } from 'lodash';
import styles from './index.less';
import Summary from '../Summary';
import SearchTable from '../../../components/SearchTable';
import TableTickets from '../TableTickets';
import FilterCount from '../../../components/FilterCount/FilterCount';

@connect(({ loading = {}, ticketManagement: { selectedLocations = [] } = {} }) => ({
  selectedLocations,
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
      applied: 0,
      form: '',
      isFiltering: false,
    };

    this.setDebounce = debounce((nameSearch) => {
      this.setState({
        nameSearch,
      });
    }, 1000);
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

  initDataTable = (tabId, nameSearch, selectedLocations = []) => {
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

  handleFilterCounts = (values) => {
    const filteredObj = Object.entries(values).filter(
      ([key, value]) => (value !== undefined && value?.length > 0) || value?.isValid,
    );
    const newObj = Object.fromEntries(filteredObj);
    this.setState({
      applied: Object.keys(newObj).length,
      isFiltering: true,
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

  setIsFiltering = () => {
    this.setState({
      isFiltering: false,
    });
  };

  render() {
    const {
      data = [],
      loading,
      loadingFilter,
      countData = [],
      selectedLocations = [],
    } = this.props;
    const { pageSelected, size, applied, form, selectedFilterTab, nameSearch, isFiltering } =
      this.state;
    return (
      <div className={styles.containerTickets}>
        <div className={styles.tabTickets}>
          <Summary setSelectedTab={this.setSelectedTab} countData={countData} />
          <div className={styles.filterTable}>
            <FilterCount
              applied={applied}
              form={form}
              setApplied={this.setApplied}
              setIsFiltering={this.setIsFiltering}
              initDataTable={this.initDataTable}
              selectedFilterTab={selectedFilterTab}
              nameSearch={nameSearch}
              selectedLocations={selectedLocations}
            />
            <SearchTable
              onChangeSearch={this.onChangeSearch}
              className={styles.searchTable}
              handleFilterCounts={this.handleFilterCounts}
              setForm={this.setForm}
              isFiltering={isFiltering}
            />
          </div>
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
