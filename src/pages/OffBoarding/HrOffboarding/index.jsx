import React, { PureComponent } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import { Tabs, Button, Row, Col } from 'antd';
import { history } from 'umi';
import HRrequestTable from './component/HrRequestTable';
import RelievingFormalities from './component/RelievingFormalities';
import Settings from './component/Settings';
import styles from './index.less';

class HROffboarding extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tabKey: '1',
    };
  }

  componentDidMount = () => {
    // history.replace();
    const { location: { state: { defaultActiveKey = '1' } = {} } = {} } = this.props;
    this.setState({
      tabKey: defaultActiveKey,
    });
  };

  onChangeTab = (key) => {
    this.setState({ tabKey: key });
  };

  render() {
    const { TabPane } = Tabs;
    const { tabKey } = this.state;
    return (
      <PageContainer>
        <div className={styles.containerEmployeeOffboarding}>
          <div className={styles.tabs}>
            <Tabs onTabClick={(key) => this.onChangeTab(key)} activeKey={tabKey}>
              <TabPane tab="Terminate work relationship" key="1">
                <div className={styles.paddingHR}>
                  <HRrequestTable onChangeTab={this.onChangeTab} />
                </div>
              </TabPane>
              <TabPane tab="Relieving Formalities" key="2">
                <RelievingFormalities />
              </TabPane>
              <TabPane tab="Settings" key="3">
                <Settings />
              </TabPane>
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
