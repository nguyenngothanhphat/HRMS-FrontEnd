import React, { Component } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import styles from './index.less';
import Summary from '../Summary';
import SearchTable from '../SearchTable';
import TableResources from '../TableResources';

@connect(
  ({
    resourceManagement: { resourceList = [], projectList=[], total = 0 } = {},
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
    START: 'Start', FETCHING: 'loading', COMPLETED:'completed'
  }

  fetchData = this.fetchStatus.START;

  constructor(props) {
    super(props);
    this.state = {
      // selectedFilterTab: '1',
      pageSelected: 1,
      size: 10,
      sort: {},
      filter: {}
      // fetchData: this.fetchStatus.START
    };
  }

  componentDidMount = async () =>  {
    // const { dispatch, resourceList, location = [] } = this.props;
    // const { selectedFilterTab, pageSelected, size } = this.state;
    // this.fetchData = true
    // this.fetchProjectList();
    this.fetchProjectList();
    this.fetchResourceList();   
    console.log('componentDidMount');
  }

  componentDidUpdate(prevProps, prevState) {
    this.fetchResourceList()
  }

  changePagination = (page, limit) => {
    this.fetchData = this.fetchStatus.START;
    this.setState({
      pageSelected: page,
      size: limit,
    });
  }

  handleLongText = (text, length) => {
    if(!text) {
      return ''
    }
    if (text.length < length) {
      return text;
    }

    const formatText = text.substring(0, length)
    return `${formatText}...${formatText.includes('(') ? ')' : ''}`
  }

  updateData = (listOffAllTicket) => {
    const array = this.formatDataSource(listOffAllTicket);
    this.setState({
      resourceList: array,
    });
  };

  // obj = {
  //   employeeId: 15,
  //   employeeName: `employee 15`,
  //   division: 'division',
  //   designation: 'designation',
  //   experience: (Math.random(i) * i).toFixed(1),
  //   projectName: '',
  //   availableStatus: 'Available Soon',
  //   comment: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint nt. ullamco est sit aliqua dolor do amet sint. Amet minim mollit non deserunt ullamcoullamco est sit aliqua dolor do amet sint. Amet minim mollit non deserunt ullamcoullamco est sit aliqua dolor do amet sint...Read More',
  //   utilization: 0,
  //   startDate: '',
  //   endDate: '',
  // };
  parseDate = (dateText) => {
    if(!dateText) {
      return '-'
    }
    return moment(dateText).format('MM/DD/YYYY')
  }

  formatDataSource = (resourceList) => {
    const dataList = [];
    const {projectList} = this.props
    // console.log(`loaded projects: ${  JSON.stringify(projectList)}`)
    // eslint-disable-next-line no-restricted-syntax
    resourceList.forEach((obj, index) => {
      const { departmentInfo, titleInfo, generalInfo, projects} = obj;
      const availableStatus = 'Available Now'
      const userName = generalInfo.workEmail.substring(0, generalInfo.workEmail.indexOf('@'))
      const employeeName = `${ generalInfo.firstName } ${generalInfo.firstName} ${ userName ? (`(${  userName  })`) : ''}`;
      const newObj = {
        employeeId: obj._id,
        employeeName: this.handleLongText(employeeName.trim(), 25),
        availableStatus,
        division: departmentInfo.name,
        designation: titleInfo.name,
        experience: generalInfo.totalExp,
        projectName: '-',
        utilization: 0,
        billStatus: '-',
        startDate: '-',
        endDate: '-',
        comment: ''
      };
      let ability = 0
      // eslint-disable-next-line no-restricted-syntax
      for(const p of projects) {
        ability += p.utilization
      }
      newObj.availableStatus = ability < 100 ? 'Available Now' : 'Available Soon'
      // console.log(`project length ${  projects.length}`)
      if(projects.length === 0) {
        dataList.push(newObj);
      } else {
        // eslint-disable-next-line no-restricted-syntax
        for(const p of projects) {
          const project = projectList.find(x => x.projectId === p.projectId)
          // console.log(`loop in projects: ${ JSON.stringify(p) }`)
          const pObj = this.cloneObj(newObj)
          pObj.projectName = p.projectName || '-'
          pObj.utilization = p.utilization || 0
          pObj.startDate = this.parseDate(p.startDate)
          pObj.endDate = this.parseDate(p.endDate)
          pObj.billStatus = p.billStatus || '-'
          pObj.project = project
          dataList.push(pObj);
        }
      }
    })
    // for (const obj, index of resourceList) {
      
    console.log(`formatDataSource: ${JSON.stringify(dataList)}`);
    return dataList;
  };

  cloneObj = (obj) => {
    const newObj = {}
    // eslint-disable-next-line no-restricted-syntax
    for(const [key, value] of Object.entries(obj)) {
      newObj[key] = value
    }
    return newObj
  }

  fetchResourceList = async() => {
    // console.log(`this.fetchData${  this.fetchData}`)
    if(this.fetchData !== this.fetchStatus.START) {
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
        ...filter
        // location,
      },
    }).then(() => {
      this.fetchData = this.fetchStatus.COMPLETED
      const { resourceList } = this.props;
      this.updateData(resourceList)
      // console.log('Completed dispatch')
    });
  };

  fetchProjectList = async() => {
    const { dispatch } = this.props;
    dispatch({
      type: 'resourceManagement/getProjectList'
    });
  };



  setSelectedTab = (id) => {
    this.setState({
      selectedFilterTab: id,
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
    const { resourceList = [], projectList, } = this.state;
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
