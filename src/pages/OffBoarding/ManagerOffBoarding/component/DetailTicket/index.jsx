import React, { Component, Fragment } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import { Affix, Row, Col, Spin } from 'antd';
import { formatMessage, connect } from 'umi';
import EditComment from '@/components/EditComment';
import StatusRequest from '@/components/StatusRequest';
import ResignationRequestDetail from './components/ResignationRequestDetail';
import RequesteeDetail from './components/RequesteeDetail';
import ButtonSet1On1 from './components/ButtonSet1On1';
import ScheduleMeeting from './components/ScheduleMeeting';
import RightContent from './components/RightContent';
import ModalNotice from './components/ModalNotice';
import ReasonPutOnHold from './components/ReasonPutOnHold';
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
      showModalSuccessfully = false,
      listAssignee = [],
    } = {},
    user: { currentUser: { company: { _id: company } = {} } = {} } = {},
  }) => ({
    myRequest,
    list1On1,
    listMeetingTime,
    listProjectByEmployee,
    loading: loading.effects['offboarding/fetchRequestById'],
    loadingReview: loading.effects['offboarding/reviewRequest'],
    itemNewCreate1On1,
    showModalSuccessfully,
    company,
    listAssignee,
  }),
)
class DetailTicket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectButton: '',
    };
  }

  componentDidMount() {
    const {
      dispatch,
      match: { params: { id: code = '' } = {} },
      company,
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
    dispatch({
      type: 'offboarding/getListAssignee',
      payload: {
        company,
      },
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'offboarding/save',
      payload: {
        itemNewCreate1On1: {},
        myRequest: {},
        showModalSuccessfully: false,
      },
    });
  }

  hideModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'offboarding/save',
      payload: {
        showModalSuccessfully: false,
      },
    });
    this.setState({ selectButton: '' });
  };

  openFormReason = () => {
    this.setState({
      selectButton: 'ON-HOLD',
    });
  };

  hideFormOnHold = () => {
    this.setState({
      selectButton: '',
    });
  };

  handleReviewRequest = (action) => {
    const {
      dispatch,
      match: { params: { id = '' } = {} },
    } = this.props;
    this.setState({ selectButton: action });
    dispatch({
      type: 'offboarding/reviewRequest',
      payload: {
        id,
        action,
      },
    });
  };

  renderBlockNotifications = () => {
    const { loadingReview } = this.props;
    return (
      <Row>
        <div className={styles.notification}>
          {loadingReview ? (
            <div className={styles.notification__loading}>
              <Spin />
            </div>
          ) : (
            <div className={styles.notification__content}>
              <span>
                By default notifications will be sent to HR, your manager and recursively loop to
                your department head.
              </span>
              <span style={{ cursor: 'pointer' }} onClick={this.openFormReason}>
                {formatMessage({ id: 'pages.offBoarding.putOnHold' })}
              </span>
              <span
                style={{ cursor: 'pointer' }}
                onClick={() => this.handleReviewRequest('REJECTED')}
              >
                {formatMessage({ id: 'pages.offBoarding.reject' })}
              </span>
              <span
                style={{ cursor: 'pointer' }}
                onClick={() => this.handleReviewRequest('ACCEPTED')}
              >
                {formatMessage({ id: 'pages.offBoarding.accept' })}
              </span>
            </div>
          )}
        </div>
      </Row>
    );
  };

  checkShowNotification = () => {
    const { myRequest: { manager: { _id: idManager = '' } = {} } = {}, list1On1 = [] } = this.props;
    const listHasAssignee = list1On1.filter((item) => {
      const { assignee: { _id: assigneeId = '' } = {} } = item;
      return assigneeId;
    });
    const listCommentOfManagerCompleted = list1On1.filter((item) => {
      const { ownerComment: { _id: idOwner = '' } = {}, status = '' } = item;
      return idOwner === idManager && status === 'COMPLETED';
    });

    const listCommentAssigneeCompleted = listHasAssignee.filter((item) => {
      const { status = '' } = item;
      return status === 'COMPLETED';
    });

    let check = false;
    if (listHasAssignee.length === 0 && listCommentOfManagerCompleted.length !== 0) {
      check = true;
    } else if (listCommentAssigneeCompleted.length !== 0) {
      check = true;
    }
    return check;
  };

  render() {
    const { selectButton } = this.state;
    const {
      loading,
      myRequest = {},
      list1On1 = [],
      listProjectByEmployee: listProject = [],
      showModalSuccessfully,
      listAssignee = [],
    } = this.props;
    const {
      status = '',
      employee: {
        _id: ownerRequest = '',
        generalInfo: { firstName: nameEmployee = '', employeeId = '', avatar = '' } = {},
        title: { name: title = '' } = {},
      } = {},
    } = myRequest;
    const filterListAssignee = listAssignee.filter((item) => item._id !== ownerRequest);
    if (loading)
      return (
        <div className={styles.viewLoading}>
          <Spin size="large" />
        </div>
      );
    const employeeInfo = { nameEmployee, employeeId, avatar, title };
    const listScheduleMeeting = list1On1.filter((item) => item.content === '');
    const listComment = list1On1.filter((item) => item.content !== '');
    const checkShowNotification = this.checkShowNotification();

    return (
      <>
        <PageContainer>
          <div className={styles.detailTicket}>
            <Affix offsetTop={40}>
              <div className={styles.titlePage}>
                <p className={styles.titlePage__text}>
                  Terminate work relationship with {nameEmployee} [{employeeId}]
                </p>
                <StatusRequest status={status} />
              </div>
            </Affix>
            <Row className={styles.detailTicket__content} gutter={[40, 0]}>
              <Col span={18}>
                <RequesteeDetail employeeInfo={employeeInfo} listProject={listProject} />
                <ResignationRequestDetail itemRequest={myRequest} />            
                {listComment.length !== 0 && (
                  <div className={styles.viewListComment}>
                    {listComment.map((item) => {
                      const { _id } = item;
                      return (
                        <Fragment key={_id}>
                          <EditComment itemComment={item} />
                        </Fragment>
                      );
                    })}
                  </div>
                )}
                {listScheduleMeeting.map((item) => {
                  return (
                    <Fragment key={item._id}>
                      <ScheduleMeeting data={item} />
                    </Fragment>
                  );
                })}
                <ButtonSet1On1 itemRequest={myRequest} listAssignee={filterListAssignee} />
                {selectButton === 'ON-HOLD' && <ReasonPutOnHold hideForm={this.hideFormOnHold} />}
              </Col>
              <Col span={6}>
                <RightContent />
              </Col>
            </Row>
            {checkShowNotification &&
              status === 'IN-PROGRESS' &&
              selectButton !== 'ON-HOLD' &&
              this.renderBlockNotifications()}
          </div>
        </PageContainer>
        <ModalNotice
          visible={showModalSuccessfully}
          type={selectButton}
          handleCancel={this.hideModal}
        />
      </>
    );
  }
}

export default DetailTicket;
