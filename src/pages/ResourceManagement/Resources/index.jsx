import React, { Component } from 'react';
import { Button, Col, Row, Tabs, Dropdown, Menu } from 'antd';
import { history, connect, formatMessage } from 'umi';
import { debounce } from 'lodash';
import { DownloadOutlined } from '@ant-design/icons';
import { PageContainer } from '@/layouts/layout/src';
import ResourceList from './components/ResourceList';
import styles from './index.less';
import OverView from '@/pages/ResourceManagement/components/OverView';
import ProjectList from './components/Projects';
import SmallDownArrow from '@/assets/dashboard/smallDownArrow.svg';

const baseModuleUrl = '/resource-management';

@connect(
  ({
    resourceManagement: { resourceList = [] } = {},
    user: {
      currentUser: {
        location: { _id: locationID = '' } = {},
        company: { _id: companyID } = {},
      } = {},
    } = {},
    locationSelection: { listLocationsByCompany = [] },
  }) => ({
    resourceList,
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
    };
    this.setDebounce = debounce(() => {
      this.setState({
        // resourceList: query,
        loadingSearch: false,
      });
    }, 1000);
  }

  componentDidMount() {
    const { tabName = '' } = this.props;
    if (!tabName) {
      history.replace(`${baseModuleUrl}/overview`);
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

  renderActionButton = () => {
    const { tabName = '' } = this.props;
    if (tabName === 'overview') {
      const locationMenu = (
        <Menu>
          <Menu.Item key={1}>All</Menu.Item>
        </Menu>
      );

      const divisionMenu = (
        <Menu>
          <Menu.Item key={1}>Design</Menu.Item>
        </Menu>
      );

      return (
        <div className={styles.options}>
          <div className={styles.dropdownItem}>
            <span className={styles.label}>Location</span>
            <Dropdown overlay={locationMenu}>
              <div className={styles.dropdown} onClick={(e) => e.preventDefault()}>
                <span>All</span>
                <img src={SmallDownArrow} alt="" />
              </div>
            </Dropdown>
          </div>
          <div className={styles.dropdownItem}>
            <span className={styles.label}>Division</span>
            <Dropdown overlay={divisionMenu}>
              <div className={styles.dropdown} onClick={(e) => e.preventDefault()}>
                <span>Design</span>
                <img src={SmallDownArrow} alt="" />
              </div>
            </Dropdown>
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
