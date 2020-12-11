import React, { Component } from 'react';
import { Button } from 'antd';
import { connect } from 'umi';
import ModalSet1On1 from '@/components/ModalSet1On1';
import styles from './index.less';

@connect(
  ({
    loading,
    offboarding: { listMeetingTime = [] } = {},
    user: { currentUser: { employee: { _id: myId = '' } = {} } = {} } = {},
  }) => ({
    listMeetingTime,
    loading: loading.effects['offboarding/create1On1'],
    myId,
  }),
)
class ButtonSet1On1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      keyModal: '',
    };
  }

  handleModalSet1On1 = () => {
    const { visible } = this.state;
    this.setState({
      visible: !visible,
      keyModal: !visible ? '' : Date.now(),
    });
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

  handleSubmit = (values) => {
    const { assignee } = values;
    const { dispatch, itemRequest = {}, myId = '' } = this.props;
    const { employee: { _id: meetingWith } = {}, _id: offBoardingRequest } = itemRequest;
    const payload = { meetingWith, offBoardingRequest, ownerComment: assignee || myId, ...values };
    dispatch({
      type: 'offboarding/create1On1',
      payload,
    }).then(({ statusCode }) => {
      if (statusCode === 200) {
        this.setState({}, () => {
          this.handleModalSet1On1();
          this.getList1On1();
        });
      }
    });
  };

  renderBtnSetMeeting = () => {
    const { itemRequest = {} } = this.props;
    const { employee: { generalInfo: { firstName: nameEmployee = '' } = {} } = {} } = itemRequest;
    return (
      <div className={styles.actionDetailTicket__btn}>
        <Button className={styles.btn__setMeeting} onClick={this.handleModalSet1On1}>
          <div className={styles.btn__setMeeting__text}>Set 1-on-1 with {nameEmployee}</div>
        </Button>
      </div>
    );
  };

  render() {
    const { visible, keyModal } = this.state;
    const { listMeetingTime = [], loading, itemRequest, listAssignee = [] } = this.props;
    const { employee: { generalInfo: { firstName: nameEmployee = '' } = {} } = {} } = itemRequest;
    return (
      <>
        <div className={styles.actionDetailTicket}>{this.renderBtnSetMeeting()}</div>
        <ModalSet1On1
          visible={visible}
          handleCancel={this.handleModalSet1On1}
          handleSubmit={this.handleSubmit}
          listMeetingTime={listMeetingTime}
          title={`Request 1 on 1 with ${nameEmployee}`}
          listAssignee={listAssignee}
          hideMeetingWith={false}
          textSubmit="Submit"
          key={keyModal}
          loading={loading}
        />
      </>
    );
  }
}

export default ButtonSet1On1;
