import React, { Component, Fragment } from 'react';
import { Affix, Row, Col, Spin } from 'antd';
import { formatMessage, connect } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
import EditComment from './components/EditComment';
import StatusComponent from './components/StatusComponent';
import ResignationRequestDetail from './components/ResignationRequestDetail';
import RequesteeDetail from './components/RequesteeDetail';
// import ButtonSet1On1 from './components/ButtonSet1On1';
import ScheduleMeeting from './components/ScheduleMeeting';
import Assignee from './components/Assignee';
import ModalNotice from './components/ModalNotice';
import ReasonPutOnHold from './components/ReasonPutOnHold';
import RequestChangeLWD from './components/RequestChangeLWD';
import ClosingComment from './components/ClosingComment';
import WhatNext from './components/WhatNext';
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
      hrManager = {},
    } = {},
    user: {
      currentUser: { employee: { _id: myId = '' } = {}, company: { _id: company } = {} } = {},
    } = {},
  }) => ({
    myRequest,
    list1On1,
    listMeetingTime,
    myId,
    listProjectByEmployee,
    loading: loading.effects['offboarding/fetchRequestById'],
    loadingReview: loading.effects['offboarding/reviewRequest'],
    itemNewCreate1On1,
    showModalSuccessfully,
    company,
    listAssignee,
    hrManager,
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

  handleReviewRequest = (action, id) => {
    const {
      dispatch,
      // match: { params: { id = '' } = {} },
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
      match: { params: { id = '' } = {} },
    } = this.props;
    const {
      loading,
      myRequest = {},
      list1On1 = [],
      listProjectByEmployee: listProject = [],
      showModalSuccessfully,
      listAssignee = [],
      loadingReview,
      myId = '',
      hrManager = {},
    } = this.props;
    const {
      status = '',
      employee: {
        _id: ownerRequest = '',
        generalInfo: {
          firstName: nameEmployee = '',
          employeeId = '',
          avatar = '',
          company = {},
          tenant = '',
        } = {},
        title: { name: title = '' } = {},
      } = {},
      location = {},
    } = myRequest;
    const filterListAssignee = listAssignee.filter((item) => item._id !== ownerRequest);
    if (loading)
      return (
        <div className={styles.viewLoading}>
          <Spin size="large" />
        </div>
      );
    const employeeInfo = {
      nameEmployee,
      employeeId,
      avatar,
      title,
      ownerRequest,
      location,
      company,
      tenant,
    };
    const listScheduleMeeting = list1On1.filter((item) => item.content === '');
    const listComment = list1On1.filter(
      (item) => item.content !== '' && myId === item.ownerComment?._id,
    );
    const checkShowNotification = this.checkShowNotification();
    const checkClosingComment =
      list1On1.find(
        ({ isRelieving, status: statusRelieving }) =>
          isRelieving && statusRelieving === 'COMPLETED',
      ) || {};

    const checkMyComment =
      list1On1.filter((comment) => comment.ownerComment._id === myId).length > 0;

    return (
      <>
        <PageContainer>
          <div className={styles.detailTicket}>
            <Affix offsetTop={42}>
              <div className={styles.titlePage}>
                <p className={styles.titlePage__text}>
                  Terminate work relationship with {nameEmployee} [{employeeId}]
                </p>
              </div>
            </Affix>
            <Row className={styles.detailTicket__content} gutter={[24, 0]}>
              <Col span={15}>
                <StatusComponent status={status} />
                <RequesteeDetail employeeInfo={employeeInfo} listProject={listProject} />
                <ResignationRequestDetail itemRequest={myRequest} />
                {checkShowNotification && listComment.length !== 0 && (
                  <div className={styles.viewListComment}>
                    {listComment.map((item) => {
                      const { _id } = item;
                      return (
                        <Fragment key={_id}>
                          <EditComment
                            handleReviewRequest={this.handleReviewRequest}
                            openFormReason={this.openFormReason}
                            itemComment={item}
                            loadingReview={loadingReview}
                            isOnHold={selectButton === 'ON-HOLD'}
                            id={id}
                            status={status}
                          />
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
                {!checkMyComment && (
                  <WhatNext itemRequest={myRequest} listAssignee={filterListAssignee} />
                )}
                {/* <ButtonSet1On1 itemRequest={myRequest} listAssignee={filterListAssignee} /> */}
                {selectButton === 'ON-HOLD' && <ReasonPutOnHold hideForm={this.hideFormOnHold} />}
                {checkClosingComment?._id && <ClosingComment data={checkClosingComment} />}
                {status === 'ACCEPTED' && <RequestChangeLWD />}
              </Col>
              <Col span={9}>
                <Assignee myRequest={myRequest} hrManager={hrManager} />
              </Col>
            </Row>
            {/* {checkShowNotification &&
              status === 'IN-PROGRESS' &&
              selectButton !== 'ON-HOLD' &&
              this.renderBlockNotifications()} */}
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
