import React, { PureComponent } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import { Tabs, Button, Row, Col } from 'antd';
import { connect, formatMessage, history } from 'umi';
import { isAdmin, isOwner } from '@/utils/authority';
import OnboardingOverview from './components/OnboardingOverview';
import Settings from './components/Settings';
// import CustomFields from './components/CustomFields';
import styles from './index.less';

const ROLE = {
  HRMANAGER: 'HR-MANAGER',
  HR: 'HR',
  HRGLOBAL: 'HR-GLOBAL',
};

@connect(
  ({
    loading,
    onboard: { mainTabActiveKey = '1' } = {},
    user: { currentUser: { roles = [] } = {} } = {},
  }) => ({
    loading: loading.effects['login/login'],
    roles,
    mainTabActiveKey,
  }),
)
class EmployeeOnboarding extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      rolesList: '',
    };
  }

  componentDidMount = () => {
    history.replace();
    const {
      // location: { state: { defaultActiveKey = '1' } = {} } = {},
      roles,
    } = this.props;

    const arrRole = roles.map((itemRole) => itemRole._id);

    this.setState({
      rolesList: arrRole,
    });
  };

  onChangeTab = (activeKey) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'onboard/save',
      payload: {
        mainTabActiveKey: activeKey,
      },
    });
  };

  render() {
    const { rolesList } = this.state;
    const { roles, mainTabActiveKey = '1' } = this.props;
    const getPermission = roles.map((item) => {
      const { permissions = [] } = item;
      return permissions;
    });
    const data = getPermission
      .flat()
      .filter((values, index, self) => self.indexOf(values) === index);
    const { TabPane } = Tabs;

    const checkPermission =
      rolesList.indexOf(ROLE.HRMANAGER) > -1 ||
      rolesList.indexOf(ROLE.HRGLOBAL) > -1 ||
      isAdmin() ||
      isOwner();
    return (
      <PageContainer>
        {/* {data.indexOf('P_ONBOARDING_VIEW') > -1 && rolesList.length > 0 ? ( */}
        <div className={styles.containerEmployeeOnboarding}>
          <div className={styles.tabs}>
            <Tabs activeKey={mainTabActiveKey} onTabClick={this.onChangeTab}>
              <TabPane
                tab={formatMessage({ id: 'component.employeeOnboarding.onboardingOverview' })}
                key="1"
              >
                <div className={styles.options}>
                  <Row gutter={[24, 0]}>
                    <Col>
                      <Button className={styles.generate} type="text">
                        {formatMessage({ id: 'component.employeeOnboarding.generate' })}
                      </Button>
                    </Col>
                    <Col>
                      <Button className={styles.view} type="link">
                        {formatMessage({ id: 'component.employeeOnboarding.viewActivityLogs' })}{' '}
                        (15)
                      </Button>
                    </Col>
                  </Row>
                </div>
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
