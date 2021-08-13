import React, { PureComponent } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import { DownloadOutlined } from '@ant-design/icons';
import { Tabs, Button, Row, Col } from 'antd';
import { connect, formatMessage, history } from 'umi';
import exportToExcel from '@/utils/exportAsExcel';
// import { isAdmin, isOwner } from '@/utils/authority';
import { getCurrentCompany } from '@/utils/authority';
import OnboardingOverview from './components/OnboardingOverview';
import Settings from './components/Settings';
// import CustomFields from './components/CustomFields';
import styles from './index.less';

@connect(
  ({
    loading,
    user: { permissions = [] } = {},
    onboard: { onboardingOverview: { dataAll = [] } = {} } = {},
  }) => ({
    loading: loading.effects['login/login'],
    loadingFetchList: loading.effects['onboard/fetchOnboardList'],
    permissions,
    dataAll,
  }),
)
class EmployeeOnboarding extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount = () => {
    const {
      match: { params: { tabName = '' } = {} },
    } = this.props;
    if (!tabName) {
      history.replace(`/employee-onboarding/list`);
    }
  };

  componentWillUnmount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'onboard/save',
      payload: {
        // mainTabActiveKey: '1',
      },
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
      type: 'onboard/save',
      payload: {
        isUploadingDocument: true,
      },
    });
  };

  renderActionButton = (tabName) => {
    return (
      <div className={styles.options}>
        <Row gutter={[24, 0]}>
          <Col>
            <Button
              icon={<DownloadOutlined />}
              className={styles.generate}
              type="text"
              onClick={this.downloadTemplate}
              style={tabName === 'settings' ? { display: 'none' } : {}}
            >
              {formatMessage({ id: 'component.employeeOnboarding.generate' })}
            </Button>
          </Col>
          <Col>
            <Button className={styles.view} type="link">
              {formatMessage({ id: 'component.employeeOnboarding.viewActivityLogs' })} (15)
            </Button>
            <Button className={styles.uploadDocumentBtn} onClick={this.onUploadDocument}>
              Upload
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
        {/* {data.indexOf('P_ONBOARDING_VIEW') > -1 && rolesList.length > 0 ? ( */}
        <div className={styles.containerEmployeeOnboarding}>
          <div className={styles.tabs}>
            <Tabs
              // activeKey={mainTabActiveKey}
              activeKey={tabName || 'list'}
              onChange={(key) => {
                history.push(`/employee-onboarding/${key}`);
              }}
              tabBarExtraContent={this.renderActionButton(tabName)}
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
                  {/* <TabPane
                    tab={formatMessage({ id: 'component.employeeOnboarding.customFields' })}
                    key="3"
                  >
                    <CustomFields />
                  </TabPane> */}
                </>
              ) : null}
            </Tabs>
          </div>
        </div>
        {/* ) : (
          ''
        )} */}
      </PageContainer>
    );
  }
}

export default EmployeeOnboarding;
