import { DownloadOutlined } from '@ant-design/icons';
import { Button, Col, Row, Tabs } from 'antd';
import { debounce } from 'lodash';
import React, { Component } from 'react';
import { connect, formatMessage, history } from 'umi';
import { getCurrentLocation } from '@/utils/authority';
import OverView from '@/pages/ResourceManagement/components/OverView';
import { PageContainer } from '@/layouts/layout/src';
import CustomDropdownSelector from '@/components/CustomDropdownSelector';
import ProjectList from './components/Projects';
import ResourceList from './components/ResourceList';
import styles from './index.less';
import {
  getSelectedDivisions,
  getSelectedLocations,
  setSelectedDivisions,
  setSelectedLocations,
} from '@/utils/resourceManagement';
import { exportRawDataToCSV } from '@/utils/utils';

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
  debouncedChangeLocation = debounce((selection) => {
    const { dispatch } = this.props;
    this.setState({
      selectedLocations: [...selection],
    });
    setSelectedLocations([...selection]);
    dispatch({
      type: 'resourceManagement/save',
      payload: {
        selectedLocations: [...selection],
      },
    });
  }, 1000);

  debouncedChangeDivision = debounce((selection) => {
    const { dispatch } = this.props;
    this.setState({
      selectedDivisions: [...selection],
    });
    setSelectedDivisions([...selection]);
    dispatch({
      type: 'resourceManagement/save',
      payload: {
        selectedDivisions: [...selection],
      },
    });
  }, 1000);

  constructor(props) {
    super(props);
    this.state = {
      loadingSearch: false,
      selectedDivisions: getSelectedDivisions() || [],
      selectedLocations: getSelectedLocations() || [getCurrentLocation()],
    };
    this.setDebounce = debounce(() => {
      this.setState({
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

    dispatch({
      type: 'resourceManagement/save',
      payload: {
        selectedLocations: getSelectedLocations() || [getCurrentLocation()],
      },
    });
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
    this.debouncedChangeLocation(selection);
  };

  onDivisionChange = (selection) => {
    this.debouncedChangeDivision(selection);
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
    exportRawDataToCSV(getDataExport, fileName);
  };

  exportTag = (nameTag, exportTag) => {
    if (nameTag === TABS.PROJECTS) {
      return this.exportToExcel('resourceManagement/exportReportProject', 'rm-projects.csv');
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
    const {
      divisionList = [],
      companyLocationList = [],
      headQuarterAddress = {},
      divisionInfo = {},
    } = this.props;
    const { selectedDivisions, selectedLocations } = this.state;
    // if only one selected
    const countryOfUser = headQuarterAddress ? headQuarterAddress.country._id : '';
    const divisionOfUser = divisionInfo ? divisionInfo.name : '';
    let locationOptions = [];
    let divisionOptions = [];
    if (viewModeCountry) {
      locationOptions = companyLocationList.filter((x) => {
        const countryOfList = x.headQuarterAddress ? x.headQuarterAddress.country : '';
        if (countryOfList._id === countryOfUser) {
          return {
            _id: x._id,
            name: x.name,
          };
        }
        return false;
      });
    } else {
      locationOptions = companyLocationList.map((x) => {
        return {
          _id: x._id,
          name: x.name,
        };
      });
    }

    if (viewModeDivision) {
      divisionOptions = divisionList.filter((x) => {
        if (x.name === divisionOfUser) {
          return {
            _id: x.name,
            name: x.name,
          };
        }
        return false;
      });
    } else {
      divisionOptions = divisionList.map((x) => {
        return {
          _id: x.name,
          name: x.name,
        };
      });
    }

    return (
      <div className={styles.options}>
        <CustomDropdownSelector
          options={locationOptions}
          onChange={this.onLocationChange}
          disabled={locationOptions.length < 2}
          selectedList={selectedLocations}
          label="Location"
        />

        <CustomDropdownSelector
          options={divisionOptions}
          onChange={this.onDivisionChange}
          disabled
          selectedList={selectedDivisions}
          label="Division"
        />
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
