import React, { Component } from 'react';
import { Button, Col, Tabs, Row } from 'antd';
import icon from '@/assets/offboarding-flow.svg';
import TableEmployee from './TableEmployee/index';
import styles from './index.less';

const data = [
  {
    id: 1,
    name: 'send Request',
  },
  {
    id: 2,
    name: 'Drafts',
  },
];

export default class ViewLeft extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { TabPane } = Tabs;

    const activeTitle = (
      <Row className={styles.titelContainer}>
        <Col span={4}>Inprogress (00)</Col>
        <Col span={4}>On-hold (00)</Col>
        <Col span={4}>Accepted (00)</Col>
        <Col span={4}>Rejected (00)</Col>
      </Row>
    );

    return (
      <div className={styles.root}>
        <div className={styles.title_Box}>
          <div>
            <img src={icon} alt="iconCheck" className={styles.icon} />
          </div>
          <span className={styles.title_Text}>
            Super six years with us. Thank you. We are indebted by your contribution to our company
            and clients all this while.
            <p>
              This is not the end we like to see.{' '}
              <span style={{ color: 'blue' }}> Request for feedback?</span>
            </p>
          </span>
        </div>
        <div className={styles.subTitle_Text}>
          But, if you have made your mind then lets get to it.
        </div>
        <Button className={styles.submitButton}> Set a resgination request </Button>
        <div>
          <Tabs defaultActiveKey="1" className={styles.TabComponent}>
            {data.map((tab) => (
              <TabPane tab={tab.name} key={tab.id}>
                {activeTitle}
                <TableEmployee />
              </TabPane>
            ))}
          </Tabs>
        </div>
      </div>
    );
  }
}
