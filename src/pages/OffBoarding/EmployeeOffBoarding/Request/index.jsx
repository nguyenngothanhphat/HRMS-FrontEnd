import React, { Component } from 'react';
import { Row, Col, Affix } from 'antd';
import { PageContainer } from '@/layouts/layout/src';
import { connect } from 'umi';
import Reason from './Reason';
import WorkFlow from './WorkFlow';
import ListComment from './ListComment';
import styles from './index.less';

@connect(({ offboarding: { myRequest = {}, list1On1 = [] } = {} }) => ({
  myRequest,
  list1On1,
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
    dispatch({
      type: 'offboarding/fetchRequestById',
      payload: {
        id: code,
      },
    });
    dispatch({
      type: 'offboarding/getList1On1',
      payload: {
        offBoardingRequest: code,
      },
    });
  }

  render() {
    const { myRequest = {}, list1On1 = [] } = this.props;
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
              {list1On1.length > 0 && <ListComment data={list1On1} />}
            </Col>
            <Col span={8}>
              <WorkFlow />
              {list1On1.length > 0 && (
                <div className={styles.list1on1}>
                  {list1On1.map(() => {
                    return <div>Request a 1-on-1 with [PSI: 001] Anil Reddy</div>;
                  })}
                </div>
              )}
            </Col>
          </Row>
        </div>
      </PageContainer>
    );
  }
}

export default ResignationRequest;
