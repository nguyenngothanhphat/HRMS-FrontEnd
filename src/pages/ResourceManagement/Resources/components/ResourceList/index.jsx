import React, { Component } from 'react';
import { connect } from 'umi';
import styles from './index.less';
import Summary from '../Summary';
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

  constructor(props) {
    super(props);
    this.state = {
      // selectedFilterTab: '1',
      pageSelected: 1,
      size: 10,
      sort: {},
      filter: {},
      // fetchData: this.fetchStatus.START
    };
  }

  componentDidMount = async () => {
    this.fetchProjectList();
    this.fetchResourceList();
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

  fetchResourceList = async () => {
    // console.log(`this.fetchData${  this.fetchData}`)
    if (this.fetchData !== this.fetchStatus.START) {
      return;
    }
    const { pageSelected, size, sort, filter } = this.state;
    const { dispatch } = this.props;

    this.fetchData = this.fetchStatus.FETCHING;
    dispatch({
      type: 'resourceManagement/getResources',
      payload: {
        // status: 'New',
        page: pageSelected,
        limit: size,
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

  render() {
    const { resourceList = [], projectList } = this.state;
    const { loading, loadingSearch, countData = [], total = 0 } = this.props;
    const { pageSelected, size } = this.state;
    // console.log(`render - total: ${  total}`)
    return (
      <div className={styles.containerTickets}>
        <div className={styles.tabTickets}>
          <Summary setSelectedTab={this.setSelectedTab} countData={countData} />
          <SearchTable />
        </div>
        <TableResources
          data={resourceList}
          projectList={projectList}
          loading={loading || loadingSearch}
          pageSelected={pageSelected}
          total={total}
          size={size}
          getPageAndSize={this.getPageAndSize}
        />
      </div>
    );
  }
}

export default ResourceList;
