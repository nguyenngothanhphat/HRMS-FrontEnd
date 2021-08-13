import React, { Component } from 'react';
import { Row, Col, Affix, Spin, Skeleton, DatePicker } from 'antd';
import { PageContainer } from '@/layouts/layout/src';
import ModalSet1On1 from '@/components/ModalSet1On1';
import StatusRequest from '@/components/StatusRequest';
import { connect } from 'umi';

import icon1 from '@/assets/offboarding-meeting.svg';
import icon2 from '@/assets/offboarding-close.svg';

import moment from 'moment';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import Reason from './Reason';
import WorkFlow from './WorkFlow';
import WithDraw from './WithDraw';

import styles from './index.less';

@connect(
  ({
    loading,
    offboarding: { myRequest = {}, list1On1 = [], listMeetingTime = [], hrManager = {} } = {},
  }) => ({
    myRequest,
    list1On1,
    listMeetingTime,
    hrManager,
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
      changeLWD: '',
      lastWorkingDay: '',
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

  handleRequestToChange = (e) => {
    const { target: { checked = '' } = {} } = e;
    this.setState({
      changeLWD: checked,
    });
  };

  handleLWD = (value) => {
    this.setState({
      lastLWD: value,
    });
  };

  checkStatus = (status, relievingStatus) => {
    if (status === 'ACCEPTED') {
      if (relievingStatus === 'CLOSE-RECORDS') {
        return 2;
      }
      return 1;
    }
    return 0;
  };

  render() {
    const {
      myRequest = {},
      listMeetingTime = [],
      hrManager = {},
      loading,
      loadingGetById,
      list1On1 = [],
    } = this.props;
    const { visible, keyModal, changeLWD } = this.state;
    const {
      manager: {
        generalInfo: {
          employeeId: idManager = '',
          firstName: nameManager = '',
          avatar: avatarManager = '',
        } = {},
      } = {},
      status = '',
      relievingStatus = '',
      employee: { generalInfo: { firstName: nameEmployee = '', employeeId = '' } = {} } = {},
      ticketID = '',
      assigneeHR = {},
    } = myRequest;
    if (loadingGetById) {
      return (
        <div>
          <Skeleton />
        </div>
      );
    }
    const arrStatus = ['IN-PROGRESS', 'ACCEPTED', 'ON-HOLD', 'DRAFT'];
    const listScheduleMeeting = list1On1.filter((item) => item.content === '');

    const approvalStep = this.checkStatus(status, relievingStatus);

    return (
      <PageContainer>
        <div className={styles.request}>
          <Affix offsetTop={30}>
            <div className={styles.titlePage}>
              <p className={styles.titlePage__text}>Terminate work relations with the company</p>
            </div>
          </Affix>
          <Row>
            <Col span={17}>
              <div className={styles.headerPage}>
                <div className={styles.headerPage__title}>
                  [Ticket ID: {ticketID}] Terminate work relations with the company
                </div>

                <div className={styles.headerPage__status}>
                  <StatusRequest status={status} />
                </div>
              </div>
            </Col>
          </Row>
          <Row className={styles.content} gutter={[24, 12]}>
            <Col span={17}>
              <Reason
                myRequest={myRequest}
                handleRequestToChange={this.handleRequestToChange}
                changeLWD={changeLWD}
                handleLWD={this.handleLWD}
                status={status}
              />
              {arrStatus.indexOf(status) > -1 && (
                <div className={styles.viewWithDraw}>
                  <WithDraw />
                </div>
              )}
            </Col>
            <Col span={7}>
              <WorkFlow
                approvalStep={approvalStep}
                nameManager={nameManager}
                avatarManager={avatarManager}
                hrManager={hrManager}
                assigneeHR={assigneeHR}
              />
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

          {listScheduleMeeting.map((meeting) => {
            const { meetingDate = '', meetingTime = '' } = meeting;
            const time = moment(meetingDate).format('DD.MM.YY | ') + meetingTime;

            return (
              <Row className={styles.content} gutter={[24, 12]}>
                <Col span={17}>
                  <Row className={styles.setPlan}>
                    <Col span={12}>
                      <div>
                        1-on-1 meeting with{' '}
                        <span className={styles.setPlan__text}>{nameManager}</span>
                      </div>
                    </Col>
                    <Col span={10}>
                      <div className={styles.setPlan__schedule}>Scheduled on: {time}</div>
                    </Col>
                    <Col span={2}>
                      <div className={styles.setPlan__action}>
                        <img src={icon1} alt="meeting" className={styles.setPlan__action_share} />
                        <img src={icon2} alt="meeting" className={styles.setPlan__action_close} />
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            );
          })}
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
