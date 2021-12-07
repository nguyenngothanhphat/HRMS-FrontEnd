import { DownloadOutlined } from '@ant-design/icons';
import { Button, Col, Row, Tabs } from 'antd';
import { debounce } from 'lodash';
import React, { Component } from 'react';
import { connect, formatMessage, history } from 'umi';
import OverView from '@/pages/ResourceManagement/components/OverView';
import { PageContainer } from '@/layouts/layout/src';
import SmallDownArrow from '@/assets/dashboard/smallDownArrow.svg';
import CheckboxMenu from './components/CheckboxMenu';
import ProjectList from './components/Projects';
import ResourceList from './components/ResourceList';
import styles from './index.less';

const baseModuleUrl = '/resource-management';

@connect(
  ({
    resourceManagement: { resourceList = [], divisions: divisionList = [] } = {},
    user: {
      currentUser: {
        location: { _id: locationID = '' } = {},
        company: { _id: companyID } = {},
      } = {},
    } = {},
    locationSelection: { listLocationsByCompany = [] },
  }) => ({
    resourceList,
    divisionList,
    locationID,
    companyID,
    listLocationsByCompany,
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
    const { dispatch, tabName = '' } = this.props;
    if (!tabName) {
      history.replace(`${baseModuleUrl}/overview`);
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
    const { listLocationsByCompany = [] } = this.props;
    const { selectedLocations } = this.state;
    if (selectedLocations.length === 1) {
      return listLocationsByCompany.find((x) => x._id === selectedLocations[0])?.name || '';
    }
    if (selectedLocations.length > 0 && selectedLocations.length < listLocationsByCompany.length) {
      return `${selectedLocations.length} locations selected`;
    }
    if (
      selectedLocations.length === listLocationsByCompany.length ||
      selectedLocations.length === 0
    ) {
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

  renderActionButton = () => {
    const { tabName = '', divisionList = [], listLocationsByCompany = [] } = this.props;
    const { selectedDivisions, selectedLocations } = this.state;
    // if only one selected
    const selectedLocationName = this.getSelectedLocationName();
    const selectedDivisionName = this.getSelectedDivisionName();

    if (tabName === 'overview') {
      const divisionOptions = divisionList.map((x) => {
        return {
          _id: x,
          name: x,
        };
      });
      const locationOptions = listLocationsByCompany.map((x) => {
        return {
          _id: x._id,
          name: x.name,
        };
      });
      return (
        <div className={styles.options}>
          <div className={styles.dropdownItem}>
            <span className={styles.label}>Location</span>

            <CheckboxMenu
              options={locationOptions}
              onChange={this.onLocationChange}
              list={listLocationsByCompany}
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
            >
              <div className={styles.dropdown} onClick={(e) => e.preventDefault()}>
                <span>{selectedDivisionName}</span>
                <img src={SmallDownArrow} alt="" />
              </div>
            </CheckboxMenu>
          </div>
        </div>
      );
    }
    return (
      <div className={styles.options}>
        <Row gutter={[24, 0]}>
          <Col>
            <Button
              icon={<DownloadOutlined />}
              className={styles.generate}
              type="text"
              onClick={this.downloadTemplate}
            >
              {formatMessage({ id: 'Export' })}
            </Button>
          </Col>
        </Row>
      </div>
    );
  };

  render() {
    const { TabPane } = Tabs;

    const { locationID = '', totalList = [], tabName = '' } = this.props;
    const { loadingSearch } = this.state;
    if (!tabName) return '';
    return (
      <div className={styles.ResourcesManagement}>
        <PageContainer>
          <Tabs
            activeKey={tabName || 'overview'}
            onChange={(key) => {
              history.push(`${baseModuleUrl}/${key}`);
            }}
            tabBarExtraContent={this.renderActionButton()}
            destroyInactiveTabPane
          >
            <TabPane tab="Overview" key="overview">
              <OverView />
            </TabPane>
            <TabPane tab="Resources" key="resources">
              <ResourceList
                location={[locationID]}
                // data={resourceList}
                loadingSearch={loadingSearch}
                countData={totalList}
              />
            </TabPane>
            <TabPane tab="Projects" key="projects">
              <ProjectList />
            </TabPane>
          </Tabs>
        </PageContainer>
      </div>
    );
  }
}

export default Resources;
