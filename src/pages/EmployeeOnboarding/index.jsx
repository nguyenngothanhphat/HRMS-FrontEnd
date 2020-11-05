import React, { PureComponent } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import { Tabs, Button, Row, Col } from 'antd';
import { connect, formatMessage } from 'umi';
import OnboardingOverview from './components/OnboardingOverview';
import Settings from './components/Settings';
import CustomFields from './components/CustomFields';
import styles from './index.less';

@connect(({ loading }) => ({
  loading: loading.effects['login/login'],
}))
class EmployeeOnboarding extends PureComponent {
  render() {
    const { location: { state: { defaultActiveKey = '1' } = {} } = {} } = this.props;
    const { TabPane } = Tabs;

    return (
      <PageContainer>
        <div className={styles.containerEmployeeOnboarding}>
          <div className={styles.tabs}>
            <Tabs defaultActiveKey={defaultActiveKey}>
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
              <TabPane tab={formatMessage({ id: 'component.employeeOnboarding.settings' })} key="2">
                <Settings />
              </TabPane>
              <TabPane
                tab={formatMessage({ id: 'component.employeeOnboarding.customFields' })}
                key="3"
              >
                <CustomFields />
              </TabPane>
            </Tabs>
          </div>
        </div>
      </PageContainer>
    );
  }
}

export default EmployeeOnboarding;
