import { DownloadOutlined } from '@ant-design/icons';
import { Button, Col, Row, Tabs } from 'antd';
import { debounce } from 'lodash';
import React, { Component } from 'react';
import { connect, formatMessage, history } from 'umi';
import OverView from '@/pages/ResourceManagement/components/OverView';
import { PageContainer } from '@/layouts/layout/src';
import SmallDownArrow from '@/assets/dashboard/smallDownArrow.svg';
import CheckboxMenu from '@/components/CheckboxMenu';
import ProjectList from './components/Projects';
import ResourceList from './components/ResourceList';
import styles from './index.less';

const baseModuleUrl = '/resource-management';
const TABS = {
  OVERVIEW: 'overview',
  RESOURCES: 'resources',
  PROJECTS: 'projects',
};
@connect(
  ({
    resourceManagement: { resourceList = [], divisions: divisionList = [], total = 0 } = {},
    user: {
      currentUser: {
        location: { _id: locationID = '', headQuarterAddress = {} } = {},
        company: { _id: companyID } = {},
        employee: { _id: currentUserId = '', divisionInfo = {} } = {},
      } = {},
      permissions = {},
    } = {},
    location: { companyLocationList = [] },
  }) => ({
    resourceList,
    divisionList,
    permissions,
    locationID,
    companyID,
    companyLocationList,
    currentUserId,
    total,
    headQuarterAddress,
    divisionInfo,
  }),
)
class Resources extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // resourceList: [],
      loadingSearch: false,
      selectedDivisions: [],
      selectedLocations: [],
    };
    this.setDebounce = debounce(() => {
      this.setState({
        // resourceList: query,
        loadingSearch: false,
      });
    }, 1000);
  }

  componentDidMount() {
    const { dispatch, tabName = '', permissions = {} } = this.props;
    const viewUtilizationPermission = permissions.viewUtilizationTab !== -1;
    if (!tabName) {
      history.replace(
        `${baseModuleUrl}/${viewUtilizationPermission ? TABS.OVERVIEW : TABS.RESOURCES}`,
      );
    } else {
      dispatch({
        type: 'resourceManagement/fetchDivisions',
        payload: {
          name: 'Engineering',
        },
      });
    }
  }

  onSearch = (value) => {
    const { resourceList = [] } = this.props;
    const formatValue = value.toLowerCase();
    const filterData = resourceList.filter((item) => {
      const { employeeRaise: { generalInfo: { userId = '', legalName = '' } = {} } = {} } = item;
      const formatUserIDTicket = userId.toLowerCase();
      const formatLegalName = legalName.toLowerCase();
      if (formatUserIDTicket.includes(formatValue) || formatLegalName.includes(formatValue))
        return item;
      return 0;
    });
    this.setState({ loadingSearch: true });
    this.setDebounce(filterData);
  };

  onLocationChange = (selection) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'resourceManagement/save',
      payload: {
        selectedLocations: [...selection],
      },
    });
    this.setState({
      selectedLocations: [...selection],
    });
  };

  onDivisionChange = (selection) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'resourceManagement/save',
      payload: {
        selectedDivisions: [...selection],
      },
    });
    this.setState({
      selectedDivisions: [...selection],
    });
  };

  getSelectedLocationName = () => {
    const { companyLocationList = [] } = this.props;
    const { selectedLocations } = this.state;
    if (selectedLocations.length === 1) {
      return companyLocationList.find((x) => x._id === selectedLocations[0])?.name || '';
    }
    if (selectedLocations.length > 0 && selectedLocations.length < companyLocationList.length) {
      return `${selectedLocations.length} locations selected`;
    }
    if (selectedLocations.length === companyLocationList.length || selectedLocations.length === 0) {
      return 'All';
    }
    return 'All';
  };

  getSelectedDivisionName = () => {
    const { divisionList = [] } = this.props;
    const { selectedDivisions } = this.state;
    if (selectedDivisions.length === 1) {
      return selectedDivisions[0] || '';
    }
    if (selectedDivisions.length > 0 && selectedDivisions.length < divisionList.length) {
      return `${selectedDivisions.length} divisions selected`;
    }
    if (selectedDivisions.length === divisionList.length || selectedDivisions.length === 0) {
      return 'All';
    }
    return 'All';
  };

  exportToExcel = async (type, fileName) => {
    const { dispatch, currentUserId = '', total } = this.props;
    const getListExport = await dispatch({
      type,
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

  exportTag = (nameTag, exportTag) => {
    if (nameTag === TABS.PROJECTS) {
      return this.exportToExcel('resourceManagement/exportReportProject', 'rm-projects.csv');
      // return this.exportToExcel('resourceManagement/exportResourceManagement', 'resource.csv');
    }
    return (
      <div className={styles.options}>
        <Row gutter={[24, 0]}>
          <Col>
            <Button
              icon={<DownloadOutlined />}
              className={styles.generate}
              type="text"
              onClick={exportTag}
            >
              {formatMessage({ id: 'Export' })}
            </Button>
          </Col>
        </Row>
      </div>
    );
  };

  renderActionButton = (viewModeCountry, viewModeDivision) => {
    const { divisionList = [], listLocationsByCompany = [], headQuarterAddress = {}, divisionInfo = {} } = this.props;
    const { selectedDivisions, selectedLocations } = this.state;
    // if only one selected
    const selectedLocationName = this.getSelectedLocationName();
    const selectedDivisionName = this.getSelectedDivisionName();
    const countryOfUser = headQuarterAddress ? headQuarterAddress.country._id : '';
    const divisionOfUser = divisionInfo ? divisionInfo.name : ''
    let locationOptions = [];
    let divisionOptions = [];
    if (viewModeCountry) {
      locationOptions = listLocationsByCompany.filter((x) => {
        const countryOfList = x.headQuarterAddress ? x.headQuarterAddress.country : ''
        if(countryOfList._id === countryOfUser) {
          return {
            _id: x._id,
            name: x.name,
          }
        }
        return false
      })
    } else {
      locationOptions = listLocationsByCompany.map((x) => {
        return {
          _id: x._id,
          name: x.name,
        };
      })
    } 
    
    if (viewModeDivision) {
      divisionOptions = divisionList.filter((x) => {
        if (x.name === divisionOfUser) {
          return {
            _id: x.name,
            name: x.name,
          };
        }
        return false
      })
    } else {
      divisionOptions = divisionList.map((x) => {
        return {
          _id: x.name,
          name: x.name,
        };
      })
    }

    return (
      <div className={styles.options}>
        <div className={styles.dropdownItem}>
          <span className={styles.label}>Location</span>

          <CheckboxMenu
            options={locationOptions}
            onChange={this.onLocationChange}
            list={locationOptions}
            default={selectedLocations}
          >
            <div className={styles.dropdown} onClick={(e) => e.preventDefault()}>
              <span>{selectedLocationName}</span>
              <img src={SmallDownArrow} alt="" />
            </div>
          </CheckboxMenu>
        </div>
        <div className={styles.dropdownItem}>
          <span className={styles.label}>Division</span>

          <CheckboxMenu
            options={divisionOptions}
            onChange={this.onDivisionChange}
            default={selectedDivisions}
            disabled
          >
            <div className={styles.dropdown} onClick={(e) => e.preventDefault()}>
              <span>{selectedDivisionName}</span>
              <img src={SmallDownArrow} alt="" />
            </div>
          </CheckboxMenu>
        </div>
      </div>
    );
  };

  render() {
    const { TabPane } = Tabs;

    const { locationID = '', totalList = [], tabName = '', permissions = {} } = this.props;
    const { loadingSearch } = this.state;
    if (!tabName) return '';

    // permissions
    const viewResourceListPermission = permissions.viewResourceListTab !== -1;
    const viewUtilizationPermission = permissions.viewUtilizationTab !== -1;
    const viewResourceProjectListPermission = permissions.viewResourceProjectListTab !== -1;
    // const viewModeAdmin = permissions.viewResourceAdminMode !== -1;
    const viewModeCountry = permissions.viewResourceCountryMode !== -1;
    const viewModeDivision = permissions.viewResourceDivisionMode !== -1;

    return (
      <div className={styles.ResourcesManagement}>
        <PageContainer>
          <Tabs
            activeKey={tabName || (viewUtilizationPermission ? TABS.OVERVIEW : TABS.RESOURCES)}
            onChange={(key) => {
              history.push(`${baseModuleUrl}/${key}`);
            }}
            tabBarExtraContent={this.renderActionButton(viewModeCountry, viewModeDivision)}
            destroyInactiveTabPane
          >
            {viewUtilizationPermission && (
              <TabPane tab="Overview" key={TABS.OVERVIEW}>
                <OverView />
              </TabPane>
            )}
            {viewResourceListPermission && (
              <TabPane tab="Resources" key={TABS.RESOURCES}>
                <ResourceList
                  location={[locationID]}
                  // data={resourceList}
                  loadingSearch={loadingSearch}
                  countData={totalList}
                />
              </TabPane>
            )}
            {viewResourceProjectListPermission && (
              <TabPane tab="Projects" key={TABS.PROJECTS}>
                <ProjectList />
              </TabPane>
            )}
          </Tabs>
        </PageContainer>
      </div>
    );
  }
}

export default Resources;
