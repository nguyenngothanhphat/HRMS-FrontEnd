import React, { Component } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import { Affix, Row, Col, notification } from 'antd';
import { connect } from 'umi';
import ResignationRequestDetail from './components/ResignationRequestDetail';
import RequesteeDetail from './components/RequesteeDetail';
import LastWorkingDay from './components/LastWorkingDay';
import CommentsFromHR from './components/CommentFromHr';
import ScheduleMetting from './components/SheduleMetting';
import AddContent from './components/AddContent';
import ActionSchedule from './components/ActionSchedule';
import InfoEmployee from './components/RightContent';
import styles from './index.less';

@connect(
  ({
    loading,
    offboarding: {
      myRequest = {},
      list1On1 = [],
      listProjectByEmployee = [],
      listMeetingTime = [],
    } = {},
  }) => ({
    loading: loading.effects['offboarding/create1On1'],
    myRequest,
    list1On1,
    listProjectByEmployee,
    listMeetingTime,
  }),
)
class HRDetailTicket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // editLWD: false,
      // data: false,
      openModal: false,
      // saveSchedule: false,
      onCloseSchedule: false,
      addContent: false,
      itemSet1On1: {},
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

  handleChange = () => {};

  handleSaveSchedule = (date) => {
    const {
      dispatch,
      myRequest,
      match: { params: { id: code = '' } = {} },
    } = this.props;
    const { employee: { _id } = {} } = myRequest;
    const { meetingTime, meetingDate } = date;
    dispatch({
      type: 'offboarding/create1On1',
      payload: {
        meetingDate,
        meetingTime,
        meetingWith: _id,
        offBoardingRequest: code,
      },
    }).then((response) => {
      const { statusCode, data = {} } = response;
      if (statusCode === 200) {
        this.setState({
          openModal: false,
          onCloseSchedule: true,
          itemSet1On1: data,
        });
        dispatch({
          type: 'offboarding/getList1On1',
          payload: {
            offBoardingRequest: code,
          },
        });
      }
    });
  };

  handleSaveContent = (value) => {
    const { dispatch } = this.props;
    const { itemSet1On1: { _id: id = '' } = {} } = this.state;

    dispatch({
      type: 'offboarding/complete1On1',
      payload: {
        content: value,
        id,
      },
    }).then((response) => {
      const { statusCode } = response;
      if (statusCode === 200) {
        this.setState({
          addContent: false,
        });
        notification.success({ message: `Add Content successfully!` });
      }
    });
  };

  handleclick = () => {
    this.setState({
      openModal: true,
      keyModal: Date.now(),
    });
  };

  onClose = () => {
    this.setState({
      onCloseSchedule: false,
      itemSet1On1: {},
      addContent: false,
    });
  };

  handleEdit = () => {
    this.setState({
      addContent: true,
    });
  };

  handleCandelSchedule = () => {
    this.setState({
      openModal: false,
      keyModal: '',
    });
  };

  render() {
    const { onCloseSchedule, openModal, addContent, itemSet1On1 = {}, keyModal = '' } = this.state;
    const {
      loading,
      visible,
      myRequest,
      list1On1 = [],
      listProjectByEmployee = [],
      listMeetingTime,
      match: { params: { id: code = '' } = {} },
    } = this.props;

    const {
      reasonForLeaving = '',
      requestDate = '',
      lastWorkingDate,
      employee: {
        employeeId,
        generalInfo: { firstName: nameFrist = '', avatar = '' } = {},
        title: { name: jobTitle = '' } = {},
      } = {},
    } = myRequest;

    return (
      <PageContainer>
        <div className={styles.hrDetailTicket}>
          <Affix offsetTop={40}>
            <div className={styles.titlePage}>
              <p className={styles.titlePage__text}>
                Terminate work relationship with {nameFrist} [{employeeId}]
              </p>
            </div>
          </Affix>
          <Row className={styles.detailTicket__content} gutter={[30, 30]}>
            <Col span={17}>
              <RequesteeDetail
                id={employeeId}
                avatar={avatar}
                name={nameFrist}
                jobTitle={jobTitle}
                listProject={listProjectByEmployee}
              />
              <ResignationRequestDetail
                reason={reasonForLeaving}
                date={requestDate}
                name={nameFrist}
              />
              {lastWorkingDate && <CommentsFromHR />}
              {addContent && <AddContent addcontent={(value) => this.handleSaveContent(value)} />}
              <LastWorkingDay
                list1On1={list1On1}
                handleRemoveToServer={this.handleChange}
                code={code}
                visible={visible}
                lastWorkingDate={lastWorkingDate}
              />
            </Col>
            <Col span={7}>
              <InfoEmployee />
              {lastWorkingDate && (
                <ScheduleMetting
                  loading={loading}
                  visible={openModal}
                  handleclick={this.handleclick}
                  handleSubmit={(date) => this.handleSaveSchedule(date)}
                  listMeetingTime={listMeetingTime}
                  handleCandelSchedule={this.handleCandelSchedule}
                  keyModal={keyModal}
                />
              )}
              {onCloseSchedule && (
                <ActionSchedule
                  itemSet1On1={itemSet1On1}
                  // list1On1={list1On1}
                  nameFrist={nameFrist}
                  onclose={this.onClose}
                  handleEdit={this.handleEdit}
                />
              )}
            </Col>
          </Row>
        </div>
      </PageContainer>
    );
  }
}

export default HRDetailTicket;
