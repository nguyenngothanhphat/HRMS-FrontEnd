import React, { Component } from 'react';
import { Button } from 'antd';
import { formatMessage, connect } from 'umi';
import externalLinkIcon from '@/assets/external-link.svg';
import removeIcon from '@/assets/remove-off-boarding.svg';
import ModalSet1On1 from '@/components/ModalSet1On1';
import ClosingComments from './components/ClosingComments';
import ReasonPutOnHold from './components/ReasonPutOnHold';
import styles from './index.less';

@connect(({ loading, offboarding: { list1On1 = [], listMeetingTime = [] } = {} }) => ({
  list1On1,
  listMeetingTime,
  loading: loading.effects['offboarding/create1On1'],
}))
class ActionDetailTicket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpenSetMeeting: false,
      isOpenClosingComments: false,
      isDisplayBtnSetMeeting: true,
      visible: false,
      keyModal: '',
      meetingDate: '',
      meetingTime: '',
      idSet1on1: '',
    };
  }

  handleModalSet1On1 = () => {
    const { visible } = this.state;
    this.setState({
      visible: !visible,
      keyModal: !visible ? '' : Date.now(),
    });
  };

  setMeeting1on1 = () => {
    this.setState({
      isOpenSetMeeting: true,
      isDisplayBtnSetMeeting: false,
    });
  };

  startMeeting = () => {
    this.setState({
      isOpenClosingComments: true,
      isOpenSetMeeting: false,
    });
  };

  renderScheduleMeeting = () => {
    const { meetingDate, meetingTime } = this.state;
    return (
      <div className={styles.actionDetailTicket__schedule}>
        <div className={styles.schedule__content}>
          <span className={styles.actionDetailTicket__title}>
            {formatMessage({ id: 'pages.offBoarding.1on1Meeting' })}
          </span>
          <div className={styles.actionDetailTicket__dateTime}>
            <span>
              {formatMessage({ id: 'pages.offBoarding.scheduledOn' })} : {meetingDate} &nbsp; |
              &nbsp; <span>{meetingTime}</span>
            </span>
            <span className={styles.icon__external__link}>
              <img src={externalLinkIcon} alt="external-link-icon" onClick={this.startMeeting} />
            </span>
            <span className={styles.icon__remove} onClick={this.removeScheduleMeeting}>
              <img src={removeIcon} alt="remove-icon" />
            </span>
          </div>
        </div>
      </div>
    );
  };

  getList1On1 = () => {
    const { dispatch, itemRequest: { _id: code } = {} } = this.props;
    dispatch({
      type: 'offboarding/getList1On1',
      payload: {
        offBoardingRequest: code,
      },
    });
  };

  handleSubmit = ({ meetingDate, meetingTime }) => {
    const { dispatch, itemRequest = {} } = this.props;
    const { employee: { _id: meetingWith } = {}, _id: offBoardingRequest } = itemRequest;
    const payload = { meetingWith, offBoardingRequest, meetingDate, meetingTime };
    dispatch({
      type: 'offboarding/create1On1',
      payload,
    }).then(({ statusCode, data: { _id } = {} }) => {
      if (statusCode === 200) {
        this.setState(
          {
            meetingDate,
            meetingTime,
            idSet1on1: _id,
          },
          () => {
            this.handleModalSet1On1();
            this.setMeeting1on1();
            this.getList1On1();
          },
        );
      }
    });
  };

  renderBtnSetMeeting = () => {
    const { itemRequest } = this.props;
    const { employee: { generalInfo: { firstName: nameEmployee = '' } = {} } = {} } = itemRequest;
    return (
      <div className={styles.actionDetailTicket__btn}>
        <Button className={styles.btn__setMeeting} onClick={this.handleModalSet1On1}>
          Set 1-on-1 with {nameEmployee}
        </Button>
      </div>
    );
  };

  removeScheduleMeeting = () => {
    const { dispatch } = this.props;
    this.setState({
      isOpenSetMeeting: false,
      isDisplayBtnSetMeeting: true,
      idSet1on1: '',
    });
    dispatch({
      type: 'offboarding/save',
      payload: {
        itemNewCreate1On1: {},
      },
    });
  };

  render() {
    const {
      isOpenSetMeeting,
      isOpenClosingComments,
      isDisplayBtnSetMeeting,
      visible,
      keyModal,
      idSet1on1,
    } = this.state;
    const {
      isOpenFormReason,
      listMeetingTime = [],
      loading,
      itemRequest,
      openNotification = () => {},
      listDisplay = [],
    } = this.props;
    const { employee: { generalInfo: { firstName: nameEmployee = '' } = {} } = {} } = itemRequest;
    return (
      <>
        <div className={styles.actionDetailTicket}>
          {isDisplayBtnSetMeeting && listDisplay.length === 0 && this.renderBtnSetMeeting()}
          {isOpenSetMeeting && !isDisplayBtnSetMeeting && this.renderScheduleMeeting()}
          {isOpenClosingComments && <ClosingComments idComment={idSet1on1} />}
          {isOpenFormReason && <ReasonPutOnHold openNotification={openNotification} />}
        </div>
        <ModalSet1On1
          visible={visible}
          handleCancel={this.handleModalSet1On1}
          handleSubmit={this.handleSubmit}
          listMeetingTime={listMeetingTime}
          title={`Request 1 on 1 with ${nameEmployee}`}
          hideMeetingWith
          textSubmit="Submit"
          key={keyModal}
          loading={loading}
        />
      </>
    );
  }
}

export default ActionDetailTicket;
