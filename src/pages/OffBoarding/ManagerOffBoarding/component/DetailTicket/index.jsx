import React, { PureComponent } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import { Affix, Row, Col } from 'antd';
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
    } = {},
  }) => ({
    myRequest,
    list1On1,
    listMeetingTime,
    listProjectByEmployee,
    loading: loading.effects['offboarding/fetchRequestById'],
  }),
)
class DetailTicket extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isDisplayNotifications: false,
      isOpenFormReason: false,
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

  openFormReason = () => {
    this.setState({
      isDisplayNotifications: false,
      isOpenFormReason: true,
    });
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

  handleDisplayNotifications = () => {
    this.setState({
      isDisplayNotifications: true,
    });
  };

  render() {
    const { isDisplayNotifications, isOpenFormReason } = this.state;
    const {
      loading,
      myRequest = {},
      list1On1 = [],
      listProjectByEmployee: listProject = [],
    } = this.props;
    const {
      status = '',
      employee: {
        generalInfo: { firstName: nameEmployee = '', employeeId = '', avatar = '' } = {},
        title: { name: title = '' } = {},
      } = {},
    } = myRequest;
    if (loading) return <div>Loading...</div>;
    const employeeInfo = { nameEmployee, employeeId, avatar, title };

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
              {list1On1.map((item) => {
                const { meetingDate = '', meetingTime = '', _id = '' } = item;
                const date = moment(meetingDate).format('YYYY-DD-MM');
                return (
                  <div key={_id}>
                    {date} | {meetingTime}
                  </div>
                );
              })}
              <ActionDetailTicket
                isOpenFormReason={isOpenFormReason}
                handleDisplayNotifications={this.handleDisplayNotifications}
                itemRequest={myRequest}
              />
            </Col>
            <Col span={6}>
              <RightContent />
            </Col>
          </Row>
          {isDisplayNotifications ? this.renderBlockNotifications() : ''}
        </div>
      </PageContainer>
    );
  }
}

export default DetailTicket;
