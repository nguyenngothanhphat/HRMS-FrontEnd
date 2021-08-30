import React, { PureComponent } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { Tabs, Button, Row, Col } from 'antd';
import { connect, formatMessage, history } from 'umi';
import exportToExcel from '@/utils/exportAsExcel';
import OnboardingOverview from './components/OnboardingOverview';
import Settings from './components/Settings';
import styles from './index.less';

@connect(
  ({
    user: { permissions = [] } = {},
    onboard: { onboardingOverview: { dataAll = [] } = {} } = {},
  }) => ({
    permissions,
    dataAll,
  }),
)
class Onboarding extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount = () => {
    const {
      match: { params: { tabName = '' } = {} },
    } = this.props;
    if (!tabName) {
      history.replace(`/onboarding/list`);
    }
  };

  componentWillUnmount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'onboarding/save',
      payload: {},
    });
  };

  downloadTemplate = () => {
    const { dataAll } = this.props;
    exportToExcel('test.xlsx', this.processData(dataAll));
  };

  processData = (array) => {
    // Uppercase first letter
    let capsPopulations = [];
    capsPopulations = array.map((item) => {
      const {
        generalInfo: { firstName },
      } = item.assignTo;
      const {
        generalInfo: { firstName: name },
      } = item.assigneeManager;
      return {
        'Rookie Id': item.rookieId,
        Candidate: item.candidate,
        'Rookie Name': item.rookieName,
        Position: item.position,
        Location: item.location,
        'Date of Join': item.dateJoin,
        'Assign to': firstName,
        'HR Manager': name,
        Status: item.processStatus,
      };
    });

    // Get keys, header csv
    const keys = Object.keys(capsPopulations[0]);
    const dataExport = [];
    dataExport.push(keys);

    // Add the rows
    capsPopulations.forEach((obj) => {
      const value = `${keys.map((k) => obj[k]).join('_')}`.split('_');
      dataExport.push(value);
    });

    return dataExport;
  };

  onUploadDocument = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'employeeSetting/save',
      payload: {
        uploadDocumentModalVisible: true,
      },
    });
  };

  renderActionButton = (tabName, type) => {
    return (
      <div className={styles.options}>
        <Row gutter={[24, 0]}>
          {tabName !== 'settings' && (
            <Col>
              <Button
                icon={<DownloadOutlined />}
                className={styles.generate}
                type="text"
                onClick={this.downloadTemplate}
              >
                {formatMessage({ id: 'component.employeeOnboarding.generate' })}
              </Button>
            </Col>
          )}

          {tabName === 'settings' && (type === '' || type === 'documents-templates') && (
            <Col>
              <Button
                icon={<UploadOutlined />}
                className={styles.generate}
                type="text"
                onClick={this.onUploadDocument}
              >
                Upload
              </Button>
            </Col>
          )}
          <Col>
            <Button className={styles.view} type="link">
              {formatMessage({ id: 'component.employeeOnboarding.viewActivityLogs' })} (15)
            </Button>
          </Col>
        </Row>
      </div>
    );
  };

  render() {
    const { permissions = [] } = this.props;
    const { TabPane } = Tabs;

    const viewOnboardingSettingTab = permissions.viewOnboardingSettingTab !== -1;
    const viewOnboardingOverviewTab = permissions.viewOnboardingOverviewTab !== -1;

    const {
      match: { params: { tabName = '', type = '' } = {} },
    } = this.props;

    return (
      <PageContainer>
        <div className={styles.containerOnboarding}>
          <div className={styles.tabs}>
            <Tabs
              activeKey={tabName || 'list'}
              onChange={(key) => {
                history.push(`/onboarding/${key}`);
              }}
              tabBarExtraContent={this.renderActionButton(tabName, type)}
            >
              {viewOnboardingOverviewTab && (
                <TabPane
                  tab={formatMessage({ id: 'component.employeeOnboarding.onboardingOverview' })}
                  key="list"
                >
                  <OnboardingOverview type={type} />
                </TabPane>
              )}
              {viewOnboardingSettingTab ? (
                <>
                  <TabPane
                    tab={formatMessage({ id: 'component.employeeOnboarding.settings' })}
                    key="settings"
                  >
                    <Settings type={type} />
                  </TabPane>
                </>
              ) : null}
            </Tabs>
          </div>
        </div>
      </PageContainer>
    );
  }
}

export default Onboarding;
