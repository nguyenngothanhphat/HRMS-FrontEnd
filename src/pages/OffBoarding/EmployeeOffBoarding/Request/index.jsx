import React, { Component } from 'react';
import { Row, Col, Affix } from 'antd';
import { PageContainer } from '@/layouts/layout/src';
import ModalSet1On1 from '@/components/ModalSet1On1';
import { connect } from 'umi';
import Reason from './Reason';
import WorkFlow from './WorkFlow';
import ListComment from './ListComment';
import styles from './index.less';

@connect(
  ({ loading, offboarding: { myRequest = {}, list1On1 = [], listMeetingTime = [] } = {} }) => ({
    myRequest,
    list1On1,
    listMeetingTime,
    loading: loading.effects['offboarding/create1On1'],
  }),
)
class ResignationRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      keyModal: '',
    };
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
    dispatch({
      type: 'offboarding/getMeetingTime',
    });
  }

  handleModalSet1On1 = () => {
    const { visible } = this.state;
    this.setState({
      visible: !visible,
      keyModal: !visible ? '' : Date.now(),
    });
  };

  handleSubmit = (values) => {
    const { dispatch, myRequest = {} } = this.props;
    const {
      manager: { _id: meetingWith } = {},
      // employee: { _id: employeeId } = {},
      _id: offBoardingRequest,
    } = myRequest;
    const payload = { meetingWith, offBoardingRequest, ...values };
    dispatch({
      type: 'offboarding/create1On1',
      payload,
    }).then(({ statusCode }) => {
      if (statusCode === 200) {
        this.handleModalSet1On1();
      }
    });
  };

  render() {
    const { myRequest = {}, list1On1 = [], listMeetingTime = [], loading } = this.props;
    const { visible, keyModal } = this.state;
    const {
      manager: {
        generalInfo: { employeeId: idManager = '', firstName: nameManager = '' } = {},
      } = {},
    } = myRequest;
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
              <div className={styles.viewSet1On1}>
                <div>
                  <span className={styles.viewSet1On1__request} onClick={this.handleModalSet1On1}>
                    Request a 1-on-1
                  </span>{' '}
                  with [{idManager}] {nameManager}.
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <ModalSet1On1
          visible={visible}
          handleCancel={this.handleModalSet1On1}
          handleSubmit={this.handleSubmit}
          listMeetingTime={listMeetingTime}
          title="Request 1 on 1 with reporting manager"
          hideMeetingWith
          textSubmit="Submit"
          key={keyModal}
          loading={loading}
        />
      </PageContainer>
    );
  }
}

export default ResignationRequest;
