import React, { Component } from 'react';
import { Col, Tabs, Row, Affix } from 'antd';
import { PageContainer } from '@/layouts/layout/src';
import { NavLink } from 'umi';
import TableManager from './component/TableManager';
import styles from './index.less';

class ManagerOffBoading extends Component {
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
    const activeTitle = (
      <Row className={styles.titleContainer}>
        <Col span={4}>Inprogress (00)</Col>
        <Col span={4}>On-hold (00)</Col>
        <Col span={4}>Accepted (00)</Col>
        <Col span={4}>Rejected (00)</Col>
      </Row>
    );

    return (
      <PageContainer>
        <div className={styles.managerContainer}>
          <Affix offsetTop={40}>
            <div className={styles.titlePage}>
              <p className={styles.titlePage__text}>Terminate work relationship</p>
              <div>
                <span className={styles.textActivity}>View Activity Log</span>
                <span className={styles.textActivity} style={{ color: 'red', padding: '5px' }}>
                  (00)
                </span>
              </div>
            </div>
          </Affix>
          <Row className={styles.content} gutter={[40, 0]}>
            <Col span={24}>
              <Tabs defaultActiveKey="1" className={styles.tabComponent}>
                {data.map((tab) => (
                  <TabPane tab={tab.name} key={tab.id}>
                    {activeTitle}
                    <div className={styles.tableTab}>
                      <NavLink to="/employee-offboarding/16001288">Link to detail ticket</NavLink>
                      <TableManager />
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

export default ManagerOffBoading;
