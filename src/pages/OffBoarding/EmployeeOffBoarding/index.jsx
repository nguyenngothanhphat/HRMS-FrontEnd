import React, { Component } from 'react';
import { Row, Col, Affix } from 'antd';
import { PageContainer } from '@/layouts/layout/src';
import ViewLeft from './components/ViewLeft';
import ViewRight from './components/ViewRight';
import RightDataTable from './components/RightContent';
import styles from './index.less';

class EmployeeOffBoading extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const data = [
      {
        ticketId: 16003134,
        requestOn: '22.08.2020',
        reasionOfLeaving: 'The reason why I have decide to quit….',
      },
    ];

    return (
      <PageContainer>
        <div className={styles.root}>
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
            <Col span={18}>
              <ViewLeft data={data} />
            </Col>
            <Col span={6}>{data && data ? <RightDataTable /> : <ViewRight />}</Col>
          </Row>
        </div>
      </PageContainer>
    );
  }
}

export default EmployeeOffBoading;
