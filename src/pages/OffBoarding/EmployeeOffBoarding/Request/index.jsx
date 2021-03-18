import React, { Component } from 'react';
import { Row, Col, Affix, Spin } from 'antd';
import { PageContainer } from '@/layouts/layout/src';
import ModalSet1On1 from '@/components/ModalSet1On1';
import StatusRequest from '@/components/StatusRequest';
import { connect } from 'umi';

import icon1 from '@/assets/offboarding-meeting.svg';
import icon2 from '@/assets/offboarding-close.svg';

import Reason from './Reason';
import WorkFlow from './WorkFlow';
import WithDraw from './WithDraw';

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
    const arrStatus = ['IN-PROGRESS', 'ACCEPTED', 'ON-HOLD'];
    return (
      <PageContainer>
        <div className={styles.request}>
          <Affix offsetTop={42}>
            <div className={styles.titlePage}>
              <p className={styles.titlePage__text}>Terminate work relations with the company</p>
              <StatusRequest status={status} />
            </div>
          </Affix>
          <Row className={styles.content} gutter={[24, 12]}>
            <Col span={17}>
              <Reason />
              {arrStatus.indexOf(status) > -1 && (
                <div className={styles.viewWithDraw}>
                  <WithDraw />
                </div>
              )}
            </Col>
            <Col span={7}>
              <WorkFlow approvalStep={approvalStep} nameManager={nameManager} />
              <div className={styles.viewSet1On1}>
                <div className={styles.viewSet1On1__request}>
                  <span
                    className={styles.viewSet1On1__request__text}
                    onClick={this.handleModalSet1On1}
                  >
                    Request a 1-on-1
                  </span>{' '}
                  with [{idManager}] {nameManager}
                </div>
              </div>
            </Col>
          </Row>
          <Row className={styles.content} gutter={[24, 12]}>
            <Col span={17}>
              <Row className={styles.setPlan}>
                <Col span={12}>
                  <div>
                    1-on-1 meeting with <span className={styles.setPlan__text}>{nameManager}</span>
                  </div>
                </Col>
                <Col span={10}>
                  <div className={styles.setPlan__schedule}>Scheduled on: 22.05.20 | 12 PM</div>
                </Col>
                <Col span={2}>
                  <div className={styles.setPlan__action}>
                    <img src={icon1} alt="meeting" />
                    <img src={icon2} alt="meeting" />
                  </div>
                </Col>
              </Row>
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
