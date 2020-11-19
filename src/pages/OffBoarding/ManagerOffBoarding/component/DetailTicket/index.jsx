import React, { Component } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import { Affix, Row, Col, Spin } from 'antd';
import { formatMessage, connect } from 'umi';
import moment from 'moment';
import ResignationRequestDetail from './components/ResignationRequestDetail';
import RequesteeDetail from './components/RequesteeDetail';
import ActionDetailTicket from './components/ActionDetailTicket';
import RightContent from './components/RightContent';
import styles from './index.less';

@connect(
  ({
    loading,
    offboarding: {
      myRequest = {},
      list1On1 = [],
      listMeetingTime = [],
      listProjectByEmployee = [],
      itemNewCreate1On1 = {},
    } = {},
  }) => ({
    myRequest,
    list1On1,
    listMeetingTime,
    listProjectByEmployee,
    loading: loading.effects['offboarding/fetchRequestById'],
    itemNewCreate1On1,
  }),
)
class DetailTicket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpenFormReason: false,
      handleNotification: true,
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

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'offboarding/save',
      payload: {
        itemNewCreate1On1: {},
        myRequest: {},
      },
    });
  }

  openFormReason = () => {
    this.setState({
      isOpenFormReason: true,
      handleNotification: false,
    });
  };

  openNotification = () => {
    this.setState({ isOpenFormReason: false, handleNotification: true });
  };

  renderBlockNotifications = () => {
    return (
      <Row>
        <div className={styles.notification}>
          <div className={styles.notification__content}>
            <span>
              By default notifications will be sent to HR, your manager and recursively loop to your
              department head.
            </span>
            <span onClick={this.openFormReason}>
              {formatMessage({ id: 'pages.offBoarding.putOnHold' })}
            </span>
            <span>{formatMessage({ id: 'pages.offBoarding.reject' })}</span>
            <span>{formatMessage({ id: 'pages.offBoarding.accept' })}</span>
          </div>
        </div>
      </Row>
    );
  };

  render() {
    const { isOpenFormReason, handleNotification } = this.state;
    const {
      loading,
      myRequest = {},
      list1On1 = [],
      listProjectByEmployee: listProject = [],
      itemNewCreate1On1: { _id: idNewComment } = {},
    } = this.props;
    const {
      status = '',
      employee: {
        generalInfo: { firstName: nameEmployee = '', employeeId = '', avatar = '' } = {},
        title: { name: title = '' } = {},
      } = {},
    } = myRequest;
    if (loading)
      return (
        <div className={styles.viewLoading}>
          <Spin size="large" />
        </div>
      );
    const employeeInfo = { nameEmployee, employeeId, avatar, title };
    const listComment = list1On1.filter((item) => item.content !== '');
    const listDisplay = listComment.filter((item) => item._id !== idNewComment);

    return (
      <PageContainer>
        <div className={styles.detailTicket}>
          <Affix offsetTop={40}>
            <div className={styles.titlePage}>
              <p className={styles.titlePage__text}>
                Terminate work relationship with {nameEmployee} [{employeeId}]
              </p>
              <div>Status : {status}</div>
            </div>
          </Affix>
          <Row className={styles.detailTicket__content} gutter={[40, 0]}>
            <Col span={18}>
              <RequesteeDetail employeeInfo={employeeInfo} listProject={listProject} />
              <ResignationRequestDetail itemRequest={myRequest} />            
              {listDisplay.length !== 0 && (
                <div className={styles.viewListComment}>
                  {listDisplay.map((item) => {
                    const { meetingDate = '', meetingTime = '', _id = '', content = '' } = item;
                    const date = moment(meetingDate).format('YYYY-DD-MM');
                    return (
                      <div key={_id}>
                        {date} | {meetingTime} | Content: {content}
                      </div>
                    );
                  })}
                </div>
              )}
              {listDisplay.length === 0 && (
                <ActionDetailTicket
                  isOpenFormReason={isOpenFormReason}
                  openNotification={this.openNotification}
                  itemRequest={myRequest}
                />
              )}
            </Col>
            <Col span={6}>
              <RightContent />
            </Col>
          </Row>
          {listComment.length !== 0 && handleNotification && this.renderBlockNotifications()}
        </div>
      </PageContainer>
    );
  }
}

export default DetailTicket;
