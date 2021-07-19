import { PageContainer } from '@/layouts/layout/src';
import { Affix, Col, Row, Spin } from 'antd';
import React, { Component, Fragment } from 'react';
import { connect } from 'umi';
import Comment from './components/Comment';
import ClosingComment from '../../../../ManagerOffBoarding/component/DetailTicket/components/ClosingComment';
import ModalNotice from '../../../../ManagerOffBoarding/component/DetailTicket/components/ModalNotice';
import ScheduleMeeting from '../../../../ManagerOffBoarding/component/DetailTicket/components/ScheduleMeeting';
import Assignee from './components/Assignee';
// import HrApproved from './components/HrApproved';
import RequesteeDetail from './components/RequesteeDetail';
import ResignationRequestDetail from './components/ResignationRequestDetail';
import WhatNext from './components/WhatNext';
import InfoEmployee from './components/RightContent';
import StatusDetail from './components/StatusDetail';
// import LWD from './components/LWD';
import LastWorkingDay from './components/RequestChangeLWD';

import styles from './index.less';

@connect(
  ({
    loading,
    offboarding: {
      myRequest = {},
      list1On1 = [],
      listProjectByEmployee = [],
      listMeetingTime = [],
      showModalSuccessfully = false,
      listAssignee = [],
      hrManager = {},
    } = {},
    user: { currentUser: { employee: { _id: myId = '' } = {} } = {} } = {},
  }) => ({
    loading: loading.effects['offboarding/create1On1'],
    loadingGetById: loading.effects['offboarding/fetchRequestById'],
    myRequest,
    list1On1,
    listProjectByEmployee,
    listMeetingTime,
    myId,
    showModalSuccessfully,
    listAssignee,
    hrManager,
  }),
)
class HRDetailTicket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openModal: false,
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
  };

  handleSaveSchedule = ({ meetingTime, meetingDate }) => {
    const {
      dispatch,
      myRequest,
      match: { params: { id: code = '' } = {} },
      myId,
    } = this.props;
    const { employee: { _id: meetingWith = '' } = {} } = myRequest;
    const payload = {
      meetingDate,
      meetingTime,
      meetingWith,
      offBoardingRequest: code,
      ownerComment: myId,
    };
    dispatch({
      type: 'offboarding/create1On1',
      payload,
      isEmployee: true,
    }).then(({ statusCode }) => {
      if (statusCode === 200) {
        this.handleCandelSchedule();
        dispatch({
          type: 'offboarding/getList1On1',
          payload: {
            offBoardingRequest: code,
          },
        });
      }
    });
  };

  handleclick = () => {
    this.setState({
      openModal: true,
      keyModal: Date.now(),
    });
  };

  handleCandelSchedule = () => {
    this.setState({
      openModal: false,
      keyModal: '',
    });
  };

  render() {
    const { openModal, keyModal = '' } = this.state;
    const {
      // loading,
      myRequest,
      list1On1 = [],
      listProjectByEmployee = [],
      // listMeetingTime,
      loadingGetById,
      showModalSuccessfully,
      listAssignee = [],
      myId = '',
      hrManager = {},
    } = this.props;
    const {
      // reasonForLeaving = '',
      // requestDate = '',
      status = '',
      ticketID = '',
      employee: {
        employeeId,
        generalInfo: { firstName: firstNameEmp = '' } = {},
        title: { name: jobTitle = '' } = {},
        department: { name: department = '' } = {},
        joinDate,
      } = {},
      manager: {
        _id: managerId = '',
        generalInfo: { firstName: firstNameManager = '', lastName: lastNameManager = '' } = {},
      } = {},
      // requestLastDate = '',
      assigneeHR = {},
    } = myRequest;
    if (loadingGetById) {
      return (
        <div className={styles.viewLoading}>
          <Spin size="large" />
        </div>
      );
    }

    const listScheduleMeeting = list1On1.filter((item) => item.content === '');
    const listComment = list1On1.filter((item) => item.content !== '');
    // const checkClosingComment =
    //   list1On1.find(
    //     ({ isRelieving, status: statusRelieving }) =>
    //       isRelieving && statusRelieving === 'COMPLETED',
    //   ) || {};

    const checkMyComment =
      list1On1.filter((comment) => comment.ownerComment._id === myId).length > 0;
    const isHRManager = managerId !== myId;

    return (
      <>
        <PageContainer>
          <div className={styles.hrDetailTicket}>
            <Affix offsetTop={30}>
              <div className={styles.titlePage}>
                <p className={styles.titlePage__text}>
                  [Ticket ID: {ticketID}] Terminate work relationship with {firstNameEmp} [
                  {employeeId}]
                </p>
                {/* <StatusRequest status={status} /> */}
              </div>
            </Affix>
            <Row className={styles.detailTicket__content} gutter={[30, 30]}>
              <Col span={15}>
                {/* status  */}
                <StatusDetail status={status} />

                {/* Requestee Detail */}
                <RequesteeDetail
                  id={employeeId}
                  name={firstNameEmp}
                  jobTitle={jobTitle}
                  department={department}
                  nameOfManager={`${firstNameManager} ${lastNameManager}`}
                  listProject={listProjectByEmployee}
                  joinDate={joinDate}
                />

                {/* Resignation request detail */}
                <ResignationRequestDetail itemRequest={myRequest} />
                {listComment.length !== 0 && (
                  <div className={styles.viewListComment}>
                    {listComment.map((item) => {
                      const { _id } = item;
                      return (
                        <Fragment key={_id}>
                          <Comment itemComment={item} />
                        </Fragment>
                      );
                    })}
                  </div>
                )}
                {listScheduleMeeting.map((item) => {
                  return (
                    <Fragment key={item._id}>
                      <ScheduleMeeting isHRManager={isHRManager} data={item} />
                    </Fragment>
                  );
                })}

                {/* {checkClosingComment?._id && <ClosingComment data={checkClosingComment} />} */}

                {/* {status !== 'REJECTED' && <LastWorkingDate />} */}
                {/* <HrApproved myRequest={myRequest} /> */}
                {/* <LWD myRequest={myRequest} /> */}
                {status === 'ACCEPTED' && <LastWorkingDay myRequest={myRequest} />}
                {!checkMyComment && (
                  <WhatNext itemRequest={myRequest} listAssignee={listAssignee} />
                )}
              </Col>
              <Col span={9}>
                <Assignee myRequest={myRequest} hrManager={hrManager} />
                <InfoEmployee />
                {/* <ButtonSet1On1
                  loading={loading}
                  visible={openModal}
                  handleclick={this.handleclick}
                  handleSubmit={this.handleSaveSchedule}
                  listMeetingTime={listMeetingTime}
                  handleCandelSchedule={this.handleCandelSchedule}
                  keyModal={keyModal}
                /> */}
              </Col>
            </Row>
          </div>
        </PageContainer>
        <ModalNotice
          visible={showModalSuccessfully}
          type="ACCEPTED"
          handleCancel={this.hideModal}
        />
      </>
    );
  }
}

export default HRDetailTicket;
