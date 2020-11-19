import React, { Component } from 'react';
import { Col, Tabs, Row, Affix } from 'antd';
import { PageContainer } from '@/layouts/layout/src';
// import Icon from '@ant-design/icons';
import { Link } from 'umi';
import addIcon from '@/assets/addTicket.svg';
import TabContent from './component/tabContent';
import styles from './index.less';

class HrOffBoading extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { TabPane } = Tabs;

    const data = [
      {
        id: 1,
        name: 'Team request',
      },
      {
        id: 2,
        name: 'My request',
      },
    ];

    const resignationRequest = (
      <div style={{ padding: '17px' }}>
        <img src={addIcon} alt="" style={{ marginRight: '5px' }} />
        <Link to="/hr-offboarding/resignation-request">
          <span className={styles.buttonRequest}>Initiate Resignation Request</span>
        </Link>
      </div>
    );

    return (
      <PageContainer>
        <div className={styles.managerContainer}>
          <Affix offsetTop={40}>
            <div className={styles.titlePage}>
              <p className={styles.titlePage__text}>Terminate work relationship</p>
            </div>
          </Affix>
          <Row className={styles.content} gutter={[40, 0]}>
            <Col span={24}>
              <Tabs
                defaultActiveKey="1"
                className={styles.tabComponent}
                tabBarExtraContent={resignationRequest}
              >
                {data.map((tab) => (
                  <TabPane tab={tab.name} key={tab.id}>
                    <div className={styles.tableTab}>
                      <TabContent />
                    </div>
                  </TabPane>
                ))}
              </Tabs>
            </Col>
          </Row>
        </div>
      </PageContainer>
    );
  }
}

export default HrOffBoading;
