import React, { Component } from 'react';
import { connect } from 'umi';
import styles from './index.less';
import ResourceStatus from './components/ResourceStatus';
import SearchTable from '../SearchTable';
import TableResources from '../TableResources';
import { formatData } from '@/utils/resourceManagement';

@connect(
  ({
    resourceManagement: { resourceList = [], projectList = [], total = 0 } = {},
    user: {
      currentUser: {
        location: { _id: locationID = '' } = {},
        company: { _id: companyID } = {},
      } = {},
    } = {},
    loading,
    locationSelection: { listLocationsByCompany = [] },
  }) => ({
    loading: loading.effects['resourceManagement/getResources'],
    resourceList,
    total,
    locationID,
    companyID,
    projectList,
    listLocationsByCompany,
  }),
)
class ResourceList extends Component {
  fetchStatus = {
    START: 'Start',
    FETCHING: 'loading',
    COMPLETED: 'completed',
  };

  fetchData = this.fetchStatus.START;

  filter = {
    name: undefined,
    tagDivision: [],
    title: [],
    skill: [],
    project: [],
    expYearBegin: undefined,
    expYearEnd: undefined,
  };

  constructor(props) {
    super(props);
    this.state = {
      // selectedFilterTab: '1',
      pageSelected: 1,
      availableStatus: 'ALL',
      size: 10,
      sort: {},
      filter: this.filter,
      // fetchData: this.fetchStatus.START
    };
  }

  componentDidMount = async () => {
    this.fetchProjectList();
    this.fetchStatusList();
    this.fetchResourceList();
    this.fetchEmployeeList();
    this.fetchDivisions();
    this.fetchTitleList();
  };

  componentDidUpdate() {
    this.fetchResourceList();
  }

  changePagination = (page, limit) => {
    this.fetchData = this.fetchStatus.START;
    this.setState({
      pageSelected: page,
      size: limit,
    });
  };

  updateData = (listOffAllTicket) => {
    const { projectList } = this.props;
    const array = formatData(listOffAllTicket, projectList);
    this.setState({
      resourceList: array,
    });
  };

  onFilterChange = (filters) => {
    console.log('trigger onFilterChange', JSON.stringify(filters))
    this.fetchData = this.fetchStatus.START;
    this.setState({
      filter: {...filters},
    });
  };

  fetchResourceList = async () => {
    // console.log(`this.fetchData${  this.fetchData}`)
    if (this.fetchData !== this.fetchStatus.START) {
      return;
    }
    const { pageSelected, size, sort, availableStatus } = this.state;
    const { dispatch } = this.props;
    const filter = this.convertFilter()
    console.log('payload filter', JSON.stringify(filter))
    this.fetchData = this.fetchStatus.FETCHING;
    dispatch({
      type: 'resourceManagement/getResources',
      payload: {
        // status: 'New',
        page: pageSelected,
        limit: size,
        availableStatus,
        ...sort,
        ...filter,
        // location,
      },
    }).then(() => {
      this.fetchData = this.fetchStatus.COMPLETED;
      const { resourceList } = this.props;
      this.updateData(resourceList);
      // console.log('Completed dispatch')
    });
  };

  convertFilter = () => {
    const { filter } = this.state;
    // console.log('filter after update: ', JSON.stringify(filter))
    const newFilterObj = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(filter)) {
      if (value) {
        // check if backend accept empty obj
        // newFilterObj[key] = value;
        if (Array.isArray(value) && value.length > 0) {
        newFilterObj[key] = value;
        } else if(!Array.isArray(value)) {
          newFilterObj[key] = value;
        }
      }
    }
    return newFilterObj
  };

  fetchProjectList = async () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'resourceManagement/getProjectList',
    });
  };

  getPageAndSize = (page, pageSize) => {
    // console.log('trigger change page')
    this.fetchData = this.fetchStatus.START;
    this.setState({
      pageSelected: page,
      size: pageSize,
    });
  };

  changeAvailableStatus = (status) => {
    // console.log('trigger change page')
    this.fetchData = this.fetchStatus.START;
    this.setState({
      availableStatus: status,
    });
  };

  refreshData = () => {
    this.fetchData = this.fetchStatus.START;
    this.fetchResourceList();
  }

  fetchEmployeeList = async () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'resourceManagement/getListEmployee',
    });
  };

  fetchDivisions = async () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'resourceManagement/fetchDivisions',
    });
  };

  fetchStatusList = async () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'resourceManagement/fetchResourceStatus',
      payload: {
        name: 'Engineering',
      },
    });
  };

  fetchTitleList = async () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'resourceManagement/fetchTitleList',
      // payload: {
      //     name: 'Engineering'
      // }
    });
  };

  onSort = (sort) => {
    this.fetchData = this.fetchStatus.START;
    this.setState({
      sort,
    });
  };

  render() {
    const { resourceList = [], projectList, availableStatus } = this.state;
    const { loading, loadingSearch, total = 0 } = this.props;
    const { pageSelected, size, filter } = this.state;
    // console.log(`render - total: ${  total}`)
    return (
      <div className={styles.containerTickets}>
        <div className={styles.tabTickets}>
          <ResourceStatus
            currentStatus={availableStatus}
            changeAvailableStatus={this.changeAvailableStatus}
          />
          <SearchTable onFilterChange={this.onFilterChange} filter={filter} />
        </div>
        <TableResources
          refreshData={this.refreshData}
          data={resourceList}
          projectList={projectList}
          loading={loading || loadingSearch}
          pageSelected={pageSelected}
          total={total}
          size={size}
          onSort={this.onSort}
          getPageAndSize={this.getPageAndSize}
        />
      </div>
    );
  }
}

export default ResourceList;
