import React, { Component } from 'react';
import { Row, Col, Affix } from 'antd';
import { PageContainer } from '@/layouts/layout/src';
import { connect } from 'umi';
import Step1 from './step1';
import Step2 from './step2';
// import Step3 from './step3';
// import ResignationLeft from './component/ResignationLeft';
// import Resignation from './component/ResignationRight';
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
              <Step1 data={myRequest.reasonForLeaving} />
            </Col>
            <Col span={8}>
              <Step2 />
              {/* <Step3 /> */}
            </Col>
          </Row>
        </div>
      </PageContainer>
    );
  }
}

export default ResignationRequest;
