import React, { Component, Fragment } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import { Affix, Row, Col, Spin } from 'antd';
import { connect } from 'umi';
import EditComment from '@/components/EditComment';
import ResignationRequestDetail from './components/ResignationRequestDetail';
import RequesteeDetail from './components/RequesteeDetail';
import ScheduleMeeting from '../../../../ManagerOffBoarding/component/DetailTicket/components/ScheduleMeeting';
import LastWorkingDate from './components/LWD';
// import CommentsFromHR from './components/CommentFromHr';
import ButtonSet1On1 from './components/ButtonSet1On1';
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
    user: { currentUser: { employee: { _id: myId = '' } = {} } = {} } = {},
  }) => ({
    loading: loading.effects['offboarding/create1On1'],
    loadingGetById: loading.effects['offboarding/fetchRequestById'],
    myRequest,
    list1On1,
    listProjectByEmployee,
    listMeetingTime,
    myId,
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
      loading,
      myRequest,
      list1On1 = [],
      listProjectByEmployee = [],
      listMeetingTime,
      loadingGetById,
    } = this.props;
    const {
      reasonForLeaving = '',
      requestDate = '',
      // lastWorkingDate,
      employee: {
        employeeId,
        generalInfo: { firstName: nameFrist = '', avatar = '' } = {},
        title: { name: jobTitle = '' } = {},
      } = {},
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
              {/* {lastWorkingDate && <CommentsFromHR />} */}
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
              <LastWorkingDate />
            </Col>
            <Col span={7}>
              <InfoEmployee />
              <ButtonSet1On1
                loading={loading}
                visible={openModal}
                handleclick={this.handleclick}
                handleSubmit={this.handleSaveSchedule}
                listMeetingTime={listMeetingTime}
                handleCandelSchedule={this.handleCandelSchedule}
                keyModal={keyModal}
              />
            </Col>
          </Row>
        </div>
      </PageContainer>
    );
  }
}

export default HRDetailTicket;
