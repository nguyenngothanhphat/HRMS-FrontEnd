import React, { Component } from 'react';
import { Row, Col, Affix } from 'antd';
import { PageContainer } from '@/layouts/layout/src';
import { connect } from 'umi';
import Reason from './Reason';
import WorkFlow from './WorkFlow';
import ListComment from './ListComment';
import styles from './index.less';

@connect(({ offboarding: { myRequest = {} } = {} }) => ({
  myRequest,
}))
class ResignationRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const {
      dispatch,
      match: { params: { id: code = '' } = {} },
    } = this.props;
    if (!dispatch) {
      return;
    }
    dispatch({
      type: 'offboarding/fetchMyRequest',
      payload: {
        id: code,
      },
    });
  }

  render() {
    const { myRequest = {} } = this.props;
    const dummyList1v1 = [
      {
        title: 'Reporting Manger’s comment',
        content:
          'The reason I have decided to end my journey with Lollypop here is because…The reason I have decided to end my journey with Lollypop here is because…The reason I have decided to end.',
      },
      {
        title: 'Reporting Manger’s comment',
        content:
          'The reason I have decided to end my journey with Lollypop here is because…The reason I have decided to end my journey with Lollypop here is because…The reason I have decided to end.',
      },
      {
        title: 'Reporting Manger’s comment',
        content:
          'The reason I have decided to end my journey with Lollypop here is because…The reason I have decided to end my journey with Lollypop here is because…The reason I have decided to end.',
      },
      {
        title: 'Reporting Manger’s comment',
        content:
          'The reason I have decided to end my journey with Lollypop here is because…The reason I have decided to end my journey with Lollypop here is because…The reason I have decided to end.',
      },
    ];
    return (
      <PageContainer>
        <div className={styles.request}>
          <Affix offsetTop={40}>
            <div className={styles.titlePage}>
              <p className={styles.titlePage__text}>
                Terminate work relationship with Aditya Venkatesh [PSI: 1022]
              </p>
              <div>
                <span className={styles.textActivity}>View Activity Log</span>
                <span className={styles.textActivity} style={{ color: 'red', padding: '5px' }}>
                  (00)
                </span>
              </div>
            </div>
          </Affix>
          <Row className={styles.content} gutter={[40, 40]}>
            <Col span={16}>
              <Reason data={myRequest} />
              <ListComment data={dummyList1v1} />
            </Col>
            <Col span={8}>
              <WorkFlow />
              <div className={styles.list1on1}>
                {dummyList1v1.map((item) => {
                  return <div>Request a 1-on-1 with [PSI: 001] Anil Reddy</div>;
                })}
              </div>
            </Col>
          </Row>
        </div>
      </PageContainer>
    );
  }
}

export default ResignationRequest;
