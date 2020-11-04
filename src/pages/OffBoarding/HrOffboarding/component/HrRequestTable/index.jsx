import React, { Component } from 'react';
import { Col, Tabs, Row } from 'antd';
// import { PageContainer } from '@/layouts/layout/src';
// import Icon from '@ant-design/icons';
// import { Link } from 'umi';
// import addIcon from '@/assets/addTicket.svg';
import TabContent from './tabContent';
import styles from './index.less';

class HRrequestTable extends Component {
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

    // const resignationRequest = (
    //   <div className={styles.buttonRequest}>
    //     <img src={addIcon} alt="" style={{ margin: '5px' }} />
    //     <span>Initiate Resignation Request</span>
    //   </div>
    // );

    return (
      <Row className={styles.content} gutter={[40, 0]}>
        <Col span={24}>
          <Tabs defaultActiveKey="1" className={styles.tabComponent}>
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
    );
  }
}

export default HRrequestTable;
