import React, { Component } from 'react';
import { Row, Col, Affix, Spin } from 'antd';
import { PageContainer } from '@/layouts/layout/src';
import ModalSet1On1 from '@/components/ModalSet1On1';
import StatusRequest from '@/components/StatusRequest';
import { connect } from 'umi';
import Reason from './Reason';
import WorkFlow from './WorkFlow';
import styles from './index.less';

@connect(
  ({ loading, offboarding: { myRequest = {}, list1On1 = [], listMeetingTime = [] } = {} }) => ({
    myRequest,
    list1On1,
    listMeetingTime,
    loading: loading.effects['offboarding/create1On1'],
    loadingGetById: loading.effects['offboarding/fetchRequestById'],
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
    const {
      dispatch,
      myRequest = {},
      match: { params: { id: code = '' } = {} },
    } = this.props;
    const { manager: { _id: meetingWith } = {}, _id: offBoardingRequest } = myRequest;
    const payload = { meetingWith, offBoardingRequest, ownerComment: meetingWith, ...values };
    dispatch({
      type: 'offboarding/create1On1',
      payload,
      isEmployee: true,
    }).then(({ statusCode }) => {
      if (statusCode === 200) {
        this.handleModalSet1On1();
        dispatch({
          type: 'offboarding/getList1On1',
          payload: {
            offBoardingRequest: code,
          },
        });
      }
    });
  };

  render() {
    const { myRequest = {}, listMeetingTime = [], loading, loadingGetById } = this.props;
    const { visible, keyModal } = this.state;
    const {
      approvalStep = '',
      manager: {
        generalInfo: { employeeId: idManager = '', firstName: nameManager = '' } = {},
      } = {},
      status = '',
      employee: { generalInfo: { firstName: nameEmployee = '', employeeId = '' } = {} } = {},
    } = myRequest;
    if (loadingGetById) {
      return (
        <div className={styles.viewLoading}>
          <Spin size="large" />
        </div>
      );
    }
    return (
      <PageContainer>
        <div className={styles.request}>
          <Affix offsetTop={40}>
            <div className={styles.titlePage}>
              <p className={styles.titlePage__text}>
                Terminate work relationship with {nameEmployee} [{employeeId}]
              </p>
              <StatusRequest status={status} />
            </div>
          </Affix>
          <Row className={styles.content} gutter={[40, 40]}>
            <Col span={16}>
              <Reason />
            </Col>
            <Col span={8}>
              <WorkFlow approvalStep={approvalStep} nameManager={nameManager} />
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
