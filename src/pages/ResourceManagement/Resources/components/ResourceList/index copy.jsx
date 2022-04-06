import React, { Component } from 'react';
import { connect, formatMessage } from 'umi';
import { DownloadOutlined } from '@ant-design/icons';
import { Button, Col, Row } from 'antd';
import styles from './index.less';
import ResourceStatus from './components/ResourceStatus';
import SearchTable from '../SearchTable';
import TableResources from '../TableResources';
import { formatData } from '@/utils/resourceManagement';

@connect(
  ({
    resourceManagement: {
      resourceList = [],
      projectList = [],
      total = 0,
      selectedLocations = [],
      selectedDivisions = [],
    } = {},
    user: {
      currentUser: {
        location: { _id: locationID = '' } = {},
        company: { _id: companyID } = {},
      } = {},
      permissions = {},
    } = {},
    loading,
    location: { companyLocationList = [] },
  }) => ({
    loading: loading.effects['resourceManagement/getResources'],
    resourceList,
    total,
    locationID,
    companyID,
    projectList,
    companyLocationList,
    permissions,
    selectedDivisions,
    selectedLocations,
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
    console.log('componentDidMount');
    this.fetchProjectList();
    this.fetchStatusList();
    this.fetchResourceList();
    this.fetchDivisions();
    this.fetchTitleList();
  };

  componentDidUpdate(prevProps, prevState) {
    const { selectedDivisions, selectedLocations } = this.props;
    const { filter, size, pageSelected } = this.state;
    if (
      JSON.stringify(prevProps.selectedDivisions) !== JSON.stringify(selectedDivisions) ||
      JSON.stringify(prevProps.selectedLocations) !== JSON.stringify(selectedLocations) ||
      JSON.stringify(prevState.filter) !== JSON.stringify(filter) ||
      prevState.size !== size ||
      prevState.pageSelected !== pageSelected
    ) {
      console.log('componentDidUpdate');
      this.fetchResourceList();
    }
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
    this.fetchData = this.fetchStatus.START;
    this.setState({
      filter: { ...filters },
    });
  };

  fetchResourceList = async () => {
    const { selectedLocations, selectedDivisions } = this.props;
    const { pageSelected, size, sort, availableStatus } = this.state;
    const { dispatch } = this.props;
    const filter = this.convertFilter();
    this.fetchData = this.fetchStatus.FETCHING;
    console.log(
      '🚀 ~ file: index.jsx ~ line 122 ~ ResourceList ~ fetchResourceList= ~ selectedLocations',
      selectedLocations,
    );
    dispatch({
      type: 'resourceManagement/getResources',
      payload: {
        // status: 'New',
        page: pageSelected,
        limit: size,
        availableStatus,
        ...sort,
        ...filter,
        location: selectedLocations,
        division: selectedDivisions,
      },
    }).then(() => {
      this.fetchData = this.fetchStatus.COMPLETED;
      const { resourceList } = this.props;
      this.updateData(resourceList);
    });
  };

  convertFilter = () => {
    const { filter } = this.state;
    const newFilterObj = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(filter)) {
      if (value) {
        if (Array.isArray(value) && value.length > 0) {
          newFilterObj[key] = value;
        } else if (!Array.isArray(value)) {
          newFilterObj[key] = value;
        }
      }
    }
    return newFilterObj;
  };

  fetchProjectList = async () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'resourceManagement/getProjectList',
    });
  };

  getPageAndSize = (page, pageSize) => {
    this.fetchData = this.fetchStatus.START;
    this.setState({
      pageSelected: page,
      size: pageSize,
    });
  };

  changeAvailableStatus = (status) => {
    this.fetchData = this.fetchStatus.START;
    this.setState({
      availableStatus: status,
    });
  };

  refreshData = () => {
    this.fetchData = this.fetchStatus.START;
    this.fetchResourceList();
  };

  searchTable = (searchKey) => {
    const { dispatch } = this.props;
    const { pageSelected, availableStatus } = this.state;
    const value = searchKey.searchKey || '';
    dispatch({
      type: 'resourceManagement/getResources',
      payload: {
        page: pageSelected,
        availableStatus,
        q: value,
      },
    }).then(() => {
      const { resourceList, projectList } = this.props;
      const array = formatData(resourceList, projectList);
      this.setState({
        resourceList: array,
        pageSelected: 1,
      });
    });
  };

  fetchDivisions = async () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'resourceManagement/fetchDivisions',
      payload: {
        name: 'Engineering',
      },
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

  exportToExcel = async () => {
    const { dispatch, currentUserId = '', total } = this.props;
    const fileName = 'resource.csv';
    const getListExport = await dispatch({
      type: 'resourceManagement/exportResourceManagement',
      payload: {
        employeeId: currentUserId,
        limit: total,
      },
    });
    const getDataExport = getListExport ? getListExport.data : '';
    const downloadLink = document.createElement('a');
    const universalBOM = '\uFEFF';
    downloadLink.href = `data:text/csv; charset=utf-8,${encodeURIComponent(
      universalBOM + getDataExport,
    )}`;
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  render() {
    const { resourceList = [], projectList, availableStatus } = this.state;
    const { loading, loadingSearch, total = 0, permissions } = this.props;
    const { pageSelected, size, filter } = this.state;
    // console.log(`render - total: ${  total}`)
    // permissions
    const modifyResourcePermission = permissions.modifyResource !== -1;

    return (
      <div className={styles.containerTickets}>
        <div className={styles.tabTickets}>
          <ResourceStatus
            currentStatus={availableStatus}
            changeAvailableStatus={this.changeAvailableStatus}
          />
          <div className={styles.rightHeaderTable}>
            <div className={styles.download}>
              <Row gutter={[24, 0]}>
                <Col>
                  <Button
                    icon={<DownloadOutlined />}
                    className={styles.generate}
                    type="text"
                    onClick={this.exportToExcel}
                  >
                    {formatMessage({ id: 'Export' })}
                  </Button>
                </Col>
              </Row>
            </div>
            <SearchTable
              onFilterChange={this.onFilterChange}
              filter={filter}
              searchTable={this.searchTable}
            />
          </div>
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
          allowModify={modifyResourcePermission}
        />
      </div>
    );
  }
}

export default ResourceList;
