import React, { PureComponent } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import { Tabs, Button, Row, Col } from 'antd';
import HRrequestTable from './component/HrRequestTable';
import styles from './index.less';

class HROffboarding extends PureComponent {
  render() {
    const { TabPane } = Tabs;
    return (
      <PageContainer>
        <div className={styles.containerEmployeeOffboarding}>
          <div className={styles.tabs}>
            <Tabs defaultActiveKey="1">
              <TabPane tab="Terminate work relationship" key="1">
                <div className={styles.paddingHR}>
                  <HRrequestTable />
                </div>
              </TabPane>
              <TabPane tab="Relieving Formalities" key="2" />
              <TabPane tab="Setting" key="3" />
            </Tabs>

            <div className={styles.options}>
              <Row gutter={[24, 0]}>
                <Col>
                  <Button className={styles.generate} type="primary">
                    Generate Report
                  </Button>
                </Col>
                <Col>
                  <Button className={styles.view} type="secondary">
                    View Activity log (15)
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

export default HROffboarding;
