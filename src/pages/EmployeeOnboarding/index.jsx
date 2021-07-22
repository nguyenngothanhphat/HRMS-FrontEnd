import React, { PureComponent } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import { Tabs, Button, Row, Col } from 'antd';
import { connect, formatMessage, history } from 'umi';
// import { isAdmin, isOwner } from '@/utils/authority';
import OnboardingOverview from './components/OnboardingOverview';
import Settings from './components/Settings';
// import CustomFields from './components/CustomFields';
import styles from './index.less';

@connect(({ loading, user: { permissions = [] } = {} }) => ({
  loading: loading.effects['login/login'],
  permissions,
}))
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

  renderActionButton = () => {
    return (
      <div className={styles.options}>
        <Row gutter={[24, 0]}>
          <Col>
            <Button className={styles.generate} type="text">
              {formatMessage({ id: 'component.employeeOnboarding.generate' })}
            </Button>
          </Col>
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
        {/* {data.indexOf('P_ONBOARDING_VIEW') > -1 && rolesList.length > 0 ? ( */}
        <div className={styles.containerEmployeeOnboarding}>
          <div className={styles.tabs}>
            <Tabs
              // activeKey={mainTabActiveKey}
              activeKey={tabName || 'list'}
              onChange={(key) => {
                history.push(`/employee-onboarding/${key}`);
              }}
              // tabBarExtraContent={this.renderActionButton()}
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
