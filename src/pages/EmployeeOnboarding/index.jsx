import React, { PureComponent } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import { Tabs, Button, Row, Col } from 'antd';
import { formatMessage } from 'umi';

import OnboardingOverview from './components/OnboardingOverview';
import Settings from './components/Settings';
import CustomFields from './components/CustomFields';

import styles from './index.less';

export default class EmployeeOnboarding extends PureComponent {
  render() {
    const { location: { state: { defaultActiveKey = '1' } = {} } = {} } = this.props;
    console.log(defaultActiveKey);
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

            <div className={styles.options}>
              <Row gutter={[24, 0]}>
                <Col>
                  <Button className={styles.generate} type="primary">
                    {formatMessage({ id: 'component.employeeOnboarding.generate' })}
                  </Button>
                </Col>
                <Col>
                  <Button className={styles.view} type="secondary">
                    {formatMessage({ id: 'component.employeeOnboarding.viewActivityLogs' })} (15)
                  </Button>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }
}
