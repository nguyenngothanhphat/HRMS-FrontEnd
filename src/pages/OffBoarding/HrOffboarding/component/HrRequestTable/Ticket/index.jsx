import React, { PureComponent } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import { Affix, Row, Col } from 'antd';
import { connect } from 'umi';
import ResignationRequestDetail from './components/ResignationRequestDetail';
import RequesteeDetail from './components/RequesteeDetail';
import LastWorkingDay from './components/LastWorkingDay';
import CommentsFromHR from './components/CommentFromHr';
import ScheduleMetting from './components/SheduleMetting';
import ActionSchedule from './components/ActionSchedule';
import InfoEmployee from './components/RightContent';
import styles from './index.less';

@connect(
  ({
    offboarding: {
      myRequest = {},
      list1On1 = [],
      listProjectByEmployee = [],
      listMeetingTime = [],
    } = {},
  }) => ({
    myRequest,
    list1On1,
    listProjectByEmployee,
    listMeetingTime,
  }),
)
class HRDetailTicket extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: false,
      saveSchedule: false,
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

  handleChange = () => {
    this.setState({
      data: true,
    });
  };

  handleSaveSchedule = (value) => {
    const {
      dispatch,
      myRequest,
      match: { params: { id: code = '' } = {} },
    } = this.props;
    const { employee: { _id } = {} } = myRequest;
    const { meetingTime, meetingDate } = value;
    dispatch({
      type: 'offboarding/create1On1',
      payload: {
        meetingDate,
        meetingTime,
        meetingWith: _id,
        offBoardingRequest: code,
      },
    }).then((response) => {
      const { statusCode } = response;
      if (statusCode === 200) {
        this.setState({
          saveSchedule: true,
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

  render() {
    const { data } = this.state;
    const {
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
              <CommentsFromHR list1On1={list1On1} />
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
              {data ||
                (list1On1.length > 0 && (
                  <ScheduleMetting
                    handleSubmit={(value) => this.handleSaveSchedule(value)}
                    listMeetingTime={listMeetingTime}
                  />
                ))}
              <ActionSchedule list1On1={list1On1} nameFrist={nameFrist} />
            </Col>
          </Row>
        </div>
      </PageContainer>
    );
  }
}

export default HRDetailTicket;
