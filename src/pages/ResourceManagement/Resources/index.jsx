import React, { Component } from 'react';
import { Button, Col, Row, Tabs } from 'antd';
import { history, connect, formatMessage } from 'umi';
import { debounce } from 'lodash';
import { DownloadOutlined } from '@ant-design/icons';
import { PageContainer } from '@/layouts/layout/src';
import ResourceList from './components/ResourceList';
import styles from './index.less';
import OverView from '@/pages/ResourceManagement/components/OverView';

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
    this.setDebounce = debounce((query) => {
      this.setState({
        // resourceList: query,
        loadingSearch: false,
      });
    }, 1000);
  }

  componentDidMount() {
    const { tabName = '' } = this.props;
    if (!tabName) {
      history.replace(`${baseModuleUrl}/all-resources`);
    }
  }

  componentDidUpdate() {
    // const { resourceList = [], prevProps } = this.props;
    // if (JSON.stringify(resourceList) !== JSON.stringify(prevProps.resourceList)) {
    //   this.updateData(resourceList);
    // }
    // this.dummyData()
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
    const { locationID = '', totalList = [] } = this.props;
    const { loadingSearch } = this.state;
    return (
      <div className={styles.ResourcesManagement}>
        <PageContainer>
          <Tabs
            activeKey="resource-list"
            onChange={(key) => {
              history.push(`${baseModuleUrl}/${key}`);
            }}
            tabBarExtraContent={this.renderActionButton()}
          >
            <TabPane tab="OverView" key="overview">
              <OverView />
            </TabPane>
            <TabPane tab="Resource List" key="resource-list">
              <ResourceList
                location={[locationID]}
                // data={resourceList}
                loadingSearch={loadingSearch}
                countData={totalList}
              />
            </TabPane>
          </Tabs>
        </PageContainer>
      </div>
    );
  }
}

export default Resources;
