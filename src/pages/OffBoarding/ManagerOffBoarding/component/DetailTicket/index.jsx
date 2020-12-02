import React, { Component } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import { Affix, Row, Col, Spin } from 'antd';
import { formatMessage, connect } from 'umi';
// import EditComment from '@/components/EditComment';
import StatusRequest from '@/components/StatusRequest';
import ResignationRequestDetail from './components/ResignationRequestDetail';
import RequesteeDetail from './components/RequesteeDetail';
import ActionDetailTicket from './components/ActionDetailTicket';
import RightContent from './components/RightContent';
import ModalNotice from './components/ModalNotice';
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
      isOpenFormReason: false,
      handleNotification: true,
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
      isOpenFormReason: true,
      handleNotification: false,
      selectButton: 'ON-HOLD',
    });
  };

  openNotification = () => {
    this.setState({ isOpenFormReason: false, handleNotification: true });
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

  render() {
    const { isOpenFormReason, handleNotification, selectButton } = this.state;
    const {
      loading,
      myRequest = {},
      list1On1 = [],
      listProjectByEmployee: listProject = [],
      itemNewCreate1On1: { _id: idNewComment } = {},
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
    const listComment = list1On1.filter((item) => item.content !== '');
    const listDisplay = listComment.filter((item) => item._id !== idNewComment);

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
                {/* {listDisplay.length !== 0 && (
                  <div className={styles.viewListComment}>
                    {listDisplay.map((item) => {
                      const { _id } = item;
                      return (
                        <Fragment key={_id}>
                          <EditComment itemComment={item} />
                        </Fragment>
                      );
                    })}
                  </div>
                )} */}
                <ActionDetailTicket
                  isOpenFormReason={isOpenFormReason}
                  openNotification={this.openNotification}
                  itemRequest={myRequest}
                  listDisplay={listDisplay}
                  listAssignee={filterListAssignee}
                />
              </Col>
              <Col span={6}>
                <RightContent />
              </Col>
            </Row>
            {listComment.length !== 0 &&
              handleNotification &&
              status === 'IN-PROGRESS' &&
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
