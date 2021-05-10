import React, { PureComponent } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import { Tabs, Button, Row, Col } from 'antd';
import { connect, formatMessage } from 'umi';
// import { isAdmin, isOwner } from '@/utils/authority';
import OnboardingOverview from './components/OnboardingOverview';
import Settings from './components/Settings';
// import CustomFields from './components/CustomFields';
import styles from './index.less';

@connect(
  ({ loading, onboard: { mainTabActiveKey = '1' } = {}, user: { permissions = [] } = {} }) => ({
    loading: loading.effects['login/login'],
    permissions,
    mainTabActiveKey,
  }),
)
class EmployeeOnboarding extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount = () => {};

  onChangeTab = (activeKey) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'onboard/save',
      payload: {
        mainTabActiveKey: activeKey,
      },
    });
  };

  componentWillUnmount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'onboard/save',
      payload: {
        mainTabActiveKey: '1',
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
    const { mainTabActiveKey = '1', permissions = [] } = this.props;
    const { TabPane } = Tabs;

    const checkPermission = permissions.viewOnboardingSettingTab !== -1;

    return (
      <PageContainer>
        {/* {data.indexOf('P_ONBOARDING_VIEW') > -1 && rolesList.length > 0 ? ( */}
        <div className={styles.containerEmployeeOnboarding}>
          <div className={styles.tabs}>
            <Tabs
              activeKey={mainTabActiveKey}
              onTabClick={this.onChangeTab}
              tabBarExtraContent={this.renderActionButton()}
            >
              <TabPane
                tab={formatMessage({ id: 'component.employeeOnboarding.onboardingOverview' })}
                key="1"
              >
                <OnboardingOverview />
              </TabPane>
              {checkPermission ? (
                <>
                  <TabPane
                    tab={formatMessage({ id: 'component.employeeOnboarding.settings' })}
                    key="2"
                  >
                    <Settings />
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
