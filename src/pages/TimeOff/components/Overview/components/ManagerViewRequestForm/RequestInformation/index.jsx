import { Button, Col, Input, Row } from 'antd';
import { isEmpty } from 'lodash';
import moment from 'moment';
import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import {
  checkNormalTypeTimeoff,
  getHours,
  MAX_NO_OF_DAYS_TO_SHOW,
  TIMEOFF_12H_FORMAT,
  TIMEOFF_24H_FORMAT,
  TIMEOFF_COL_SPAN_1,
  TIMEOFF_COL_SPAN_2,
  TIMEOFF_DATE_FORMAT,
  TIMEOFF_INPUT_TYPE,
  TIMEOFF_INPUT_TYPE_BY_LOCATION,
  TIMEOFF_STATUS,
  TIMEOFF_TYPE,
} from '@/utils/timeOff';
import TimeOffModal from '@/components/TimeOffModal';
import Project from './components/Project';
import PDFIcon from '@/assets/pdf_icon.png';
import styles from './index.less';

const { TextArea } = Input;
const { A, B } = TIMEOFF_TYPE;
const { IN_PROGRESS, ACCEPTED, ON_HOLD, REJECTED, DELETED } = TIMEOFF_STATUS;
@connect(({ timeOff, user: { currentUser = {}, permissions = {} } = {}, loading }) => ({
  timeOff,
  currentUser,
  permissions,
  loadingFetchLeaveRequestById: loading.effects['timeOff/fetchLeaveRequestById'],
  loadingWithdrawLeaveRequest: loading.effects['timeOff/withdrawLeaveRequest'],
  loadingApproveRequest: loading.effects['timeOff/approveRequest'],
  loadingRejectRequest: loading.effects['timeOff/rejectRequest'],
  loadingFetchProjectsOfEmployee: loading.effects['timeOff/fetchProjectsListByEmployee'],
}))
class RequestInformation extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      showWithdrawModal: false,
      isReject: false,
      commentContent: '',
      acceptWithdraw: false,
    };
  }

  refreshPage = () => {
    setTimeout(() => {
      window.location.reload(false);
    }, 500);
  };

  componentDidUpdate = (prevPorps) => {
    const { employeeId = '', dispatch } = this.props;
    if (prevPorps.employeeId !== employeeId) {
      dispatch({
        type: 'timeOff/fetchProjectsListByEmployee',
        payload: {
          employee: employeeId,
        },
      });
    }
  };

  // ON FINISH & SHOW SUCCESS MODAL WHEN CLICKING ON SUBMIT
  setShowModal = (value) => {
    this.setState({
      showModal: value,
    });
    if (!value) {
      this.setState({
        isReject: false,
      });
    }
  };

  setShowWithdrawModal = (value) => {
    this.setState({
      showWithdrawModal: value,
    });
  };

  formatDurationTime = (fromDate, toDate, type) => {
    const start = moment.utc(fromDate);
    const end = moment.utc(toDate);
    const now = start;
    const leaveTimes = [];
    const includeWeekend = type !== A && type !== B;

    if (includeWeekend) {
      while (now.isBefore(end) || now.isSame(end)) {
        leaveTimes.push(now.format(TIMEOFF_DATE_FORMAT));
        now.add(1, 'days');
      }
    } else {
      while (now.isBefore(end) || now.isSame(end)) {
        if (moment.utc(now).weekday() !== 6 && moment.utc(now).weekday() !== 0) {
          leaveTimes.push(now.format(TIMEOFF_DATE_FORMAT));
        }
        now.add(1, 'days');
      }
    }

    return leaveTimes;
  };

  // ON VIEW REPORT
  onViewReport = () => {
    // eslint-disable-next-line no-alert
    alert('VIEW REPORT');
  };

  // ON VIEW EMPLOYEE PROFILE
  onViewEmployeeProfile = (userId) => {
    history.push({
      pathname: `/directory/employee-profile/${userId}`,
    });
  };

  // REJECT CLICKED
  onRejectClicked = () => {
    this.setState({
      isReject: true,
    });
  };

  // APPROVE CLICKED
  onApproveClicked = async (_id) => {
    const { dispatch } = this.props;
    const res = await dispatch({
      type: 'timeOff/approveRequest',
      payload: {
        _id,
      },
    });
    const { statusCode = 0 } = res;
    if (statusCode === 200) {
      this.setShowModal(true);
      this.setState({
        isReject: false,
      });
    }
  };

  // ON COMMENT CHANGE
  onRejectCommentChange = (event) => {
    const { target: { value = '' } = {} } = event;
    this.setState({
      commentContent: value,
    });
  };

  // ON CANCEL
  onCancel = () => {
    this.setState({
      isReject: false,
    });
  };

  // ON REJECT SUBMIT
  onRejectSubmit = async (_id) => {
    const { commentContent } = this.state;
    const { dispatch } = this.props;
    const res = await dispatch({
      type: 'timeOff/rejectRequest',
      payload: {
        _id,
        comment: commentContent,
      },
    });
    const { statusCode = 0 } = res;
    if (statusCode === 200) {
      this.setShowModal(true);
    }
  };

  // WITHDRAW
  onApproveWithdrawClicked = async (_id) => {
    const { dispatch } = this.props;
    const res = await dispatch({
      type: 'timeOff/approveRequest',
      payload: {
        _id,
      },
    });
    const { statusCode = 0 } = res;
    if (statusCode === 200) {
      this.setShowWithdrawModal(true);
      this.setState({
        acceptWithdraw: true,
      });
    }
  };

  onRejectWithdrawClicked = async (_id) => {
    const { dispatch } = this.props;
    const res = await dispatch({
      type: 'timeOff/rejectRequest',
      payload: {
        _id,
      },
    });
    const { statusCode = 0 } = res;
    if (statusCode === 200) {
      this.setShowWithdrawModal(true);
      this.setState({
        acceptWithdraw: false,
      });
    }
  };

  getTimeLabel = (type) => {
    switch (type) {
      case 'MORNING':
        return 'Morning';
      case 'AFTERNOON':
        return 'Afternoon';
      case 'WHOLE-DAY':
        return 'Whole day';
      default:
        return type;
    }
  };

  renderDuration = () => {
    const { timeOff: { viewingLeaveRequest = {} } = {} } = this.props;

    const {
      fromDate = '',
      toDate = '',
      duration = '',
      leaveDates = [],
      // onDate = '',
      type: { type = '' } = {},
      employee: { locationInfo = {} } = {},
    } = viewingLeaveRequest;

    const formatDurationTime = this.formatDurationTime(fromDate, toDate, type);
    const listTime = leaveDates.map((x) => moment(x.date).format('MM/DD/YYYY'));
    const showAllDateList = duration <= MAX_NO_OF_DAYS_TO_SHOW;

    const BY_HOUR =
      TIMEOFF_INPUT_TYPE_BY_LOCATION[locationInfo?.headQuarterAddress?.country?._id] ===
      TIMEOFF_INPUT_TYPE.HOUR;

    const renderTableHeader = () => {
      if (BY_HOUR) {
        return (
          <Row className={styles.header} gutter={[8, 8]}>
            <Col span={TIMEOFF_COL_SPAN_2.DATE}>Date</Col>
            <Col span={TIMEOFF_COL_SPAN_2.DAY}>Day</Col>
            <Col span={TIMEOFF_COL_SPAN_2.START_TIME}>Start time</Col>
            <Col span={TIMEOFF_COL_SPAN_2.END_TIME}>End time</Col>
            <Col span={TIMEOFF_COL_SPAN_2.HOUR} style={{ textAlign: 'center' }}>
              No. of hours
            </Col>
          </Row>
        );
      }
      if (showAllDateList)
        return (
          <Row className={styles.header} gutter={[8, 8]}>
            <Col span={TIMEOFF_COL_SPAN_1.DATE}>Date</Col>
            <Col span={TIMEOFF_COL_SPAN_1.DAY}>Day</Col>
            <Col span={TIMEOFF_COL_SPAN_1.COUNT}>Count/Q.ty</Col>
          </Row>
        );
      return (
        <Row className={styles.header} gutter={[8, 8]}>
          <Col span={TIMEOFF_COL_SPAN_1.DATE}>From</Col>
          <Col span={TIMEOFF_COL_SPAN_1.DAY}>To</Col>
          <Col span={TIMEOFF_COL_SPAN_1.COUNT}>No. of Days</Col>
        </Row>
      );
    };

    const renderTableContent = () => {
      if (BY_HOUR) {
        return (
          <>
            {formatDurationTime.map((date, index) => {
              return (
                <Row
                  className={styles.duration}
                  key={`${index + 1}`}
                  justify="center"
                  align="center"
                  gutter={[8, 8]}
                >
                  <Col span={TIMEOFF_COL_SPAN_2.DATE}>
                    {moment.utc(date).locale('en').format(TIMEOFF_DATE_FORMAT)}
                  </Col>
                  <Col span={TIMEOFF_COL_SPAN_2.DAY}>
                    {moment.utc(date).locale('en').format('dddd')}
                  </Col>
                  <Col span={TIMEOFF_COL_SPAN_2.START_TIME}>
                    {!isEmpty(leaveDates)
                      ? moment
                          .utc(leaveDates[index].startTime, TIMEOFF_24H_FORMAT)
                          .format(TIMEOFF_12H_FORMAT)
                      : ''}
                  </Col>
                  <Col span={TIMEOFF_COL_SPAN_2.END_TIME}>
                    {!isEmpty(leaveDates)
                      ? moment
                          .utc(leaveDates[index].endTime, TIMEOFF_24H_FORMAT)
                          .format(TIMEOFF_12H_FORMAT)
                      : ''}
                  </Col>
                  <Col span={TIMEOFF_COL_SPAN_2.HOUR} style={{ textAlign: 'center' }}>
                    {!isEmpty(leaveDates)
                      ? getHours(
                          leaveDates[index].startTime,
                          leaveDates[index].endTime,
                          TIMEOFF_24H_FORMAT,
                        )
                      : ''}
                  </Col>
                </Row>
              );
            })}
          </>
        );
      }
      if (showAllDateList)
        return (
          <>
            {(!checkNormalTypeTimeoff(type) ? formatDurationTime : listTime).map((date, index) => {
              return (
                <Row
                  className={styles.duration}
                  key={`${index + 1}`}
                  justify="center"
                  align="center"
                  gutter={[8, 8]}
                >
                  <Col span={TIMEOFF_COL_SPAN_1.DATE}>
                    {moment.utc(date).locale('en').format(TIMEOFF_DATE_FORMAT)}
                  </Col>
                  <Col span={TIMEOFF_COL_SPAN_1.DAY}>
                    {moment.utc(date).locale('en').format('dddd')}
                  </Col>
                  <Col span={TIMEOFF_COL_SPAN_1.COUNT}>
                    {!isEmpty(leaveDates) ? this.getTimeLabel(leaveDates[index]?.timeOfDay) : ''}
                  </Col>
                </Row>
              );
            })}
          </>
        );

      return (
        <Row className={styles.duration} justify="center" align="center" gutter={[8, 8]}>
          <Col span={TIMEOFF_COL_SPAN_1.DATE}>
            {moment.utc(fromDate).locale('en').format(TIMEOFF_DATE_FORMAT)}
          </Col>
          <Col span={TIMEOFF_COL_SPAN_1.DAY}>
            {moment.utc(toDate).locale('en').format(TIMEOFF_DATE_FORMAT)}
          </Col>
          <Col span={TIMEOFF_COL_SPAN_1.COUNT}>{duration}</Col>
        </Row>
      );
    };

    return (
      <>
        <Row style={{ paddingBottom: '5px' }}>
          <Col span={6}>Duration</Col>
          {!isEmpty(listTime || formatDurationTime) && (
            <>
              <Col span={18} className={styles.detailColumn}>
                <div className={styles.extraTimeSpent}>{renderTableHeader()}</div>
              </Col>
            </>
          )}
        </Row>
        <Row>
          <Col span={6} />
          <Col span={18}>{renderTableContent()}</Col>
        </Row>
      </>
    );
  };

  attachmentsContent = () => {
    const { timeOff: { viewingLeaveRequest: { attachments = [] } = {} } = {} } = this.props;
    return (
      <span className={styles.attachments}>
        {!isEmpty(attachments)
          ? attachments.map((val) => {
              const attachmentSlice = () => {
                if (val.attachmentName) {
                  if (val.attachmentName.length > 70) {
                    return `${val.attachmentName.substr(0, 8)}...${val.attachmentName.substr(
                      val.attachmentName.length - 6,
                      val.attachmentName.length,
                    )}`;
                  }
                  return val.attachmentName;
                }
                return '';
              };

              return (
                <div className={styles.attachments__file}>
                  <a href={val.attachmentUrl} target="_blank" rel="noreferrer">
                    {attachmentSlice()}
                  </a>
                  <img className={styles.attachmentsImg} src={PDFIcon} alt="pdf" />
                </div>
              );
            })
          : 'N/A'}
      </span>
    );
  };

  render() {
    const { showModal, showWithdrawModal, isReject, acceptWithdraw } = this.state;
    const {
      timeOff: { viewingLeaveRequest = {}, projectsList = [] } = {},
      currentUser: { employee: { _id: myId = '' } = {} } = {},
      permissions = {},
      loadingApproveRequest,
      loadingRejectRequest,
      // loadingFetchProjectsOfEmployee,
    } = this.props;
    const {
      status = '',
      _id = '',
      subject = '',
      // onDate = '',
      description = '',
      type: { name = '' } = {},
      employee: {
        // _id: employeeId = '',
        generalInfoInfo: { legalName = '', userId = '' } = {},
        employeeId: employeeIdText = '',
        titleInfo: { name: position = '' } = {},
      } = {},
      comment = '',
      withdraw: {
        //  title = '',
        reason = '',
      } = {},
      withdraw = {},
      approvalManager: { _id: managerId = '' } = {},
    } = viewingLeaveRequest;

    const viewHRTimeoff = permissions.viewHRTimeoff !== -1;

    // only manager accept/reject a ticket
    // const isMyTicket = (myId === managerId && status !== ON_HOLD) || viewHRTimeoff;
    const isMyTicket = myId === managerId || viewHRTimeoff;

    return (
      <div className={styles.RequestInformation}>
        <div className={styles.requesteeDetails}>
          <div className={styles.formTitle}>
            <span className={styles.title}>Requestee details</span>
          </div>
          <div className={styles.formContent}>
            <Row>
              <Col span={6}>Employee ID</Col>
              <Col span={18} className={styles.detailColumn}>
                <span className={styles.fieldValue}>{employeeIdText}</span>
              </Col>
            </Row>
            <Row>
              <Col span={6}>Employee Name</Col>
              <Col span={18} className={styles.detailColumn}>
                <span
                  onClick={() => this.onViewEmployeeProfile(userId)}
                  className={styles.employeeLink}
                >
                  {legalName}
                </span>
              </Col>
            </Row>
            <Row>
              <Col span={6}>Position</Col>
              <Col span={18} className={styles.detailColumn}>
                <span>{position}</span>
              </Col>
            </Row>
            <div className={styles.projectList}>
              {/* <span className={styles.title}>Projects</span> */}
              <Row>
                <Col span={5}>Current Project</Col>
                {!isEmpty(projectsList) && (
                  <>
                    <Col span={5}>Project Manager</Col>
                    <Col span={5}>Start Date</Col>
                    <Col span={5}>End Date</Col>
                    <Col span={4}>Project Health</Col>
                  </>
                )}
              </Row>

              {projectsList.length === 0 ? (
                <>
                  <Row>
                    <Col span={6} className={styles.detailColumn}>
                      <span>No project</span>
                    </Col>
                  </Row>
                </>
              ) : (
                <>
                  {projectsList.map((x) => {
                    const {
                      projectManager = {},
                      projectHealth = 0,
                      startDate = '',
                      endDate = '',
                      project = {},
                    } = x;
                    return (
                      <>
                        <Project
                          project={project}
                          projectManager={projectManager}
                          projectHealth={projectHealth}
                          startDate={startDate}
                          endDate={endDate}
                          item={x}
                        />
                        {/* {index + 1 < projects.length && <div className={styles.divider} />} */}
                      </>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        </div>

        <div className={styles.requesteeDetails}>
          <div className={styles.formTitle}>
            <span className={styles.title}>Timeoff request details</span>
          </div>

          <div className={styles.formContent}>
            <Row>
              <Col span={6}>Timeoff Type</Col>
              <Col span={18} className={styles.detailColumn}>
                <span className={styles.fieldValue}>{name}</span>
              </Col>
            </Row>
            <Row>
              <Col span={6}>Subject</Col>
              <Col span={18} className={styles.detailColumn}>
                <span>{subject}</span>
              </Col>
            </Row>
            {this.renderDuration()}
            <Row>
              <Col span={6}>Description</Col>
              <Col span={18} className={styles.detailColumn}>
                <span>{description}</span>
              </Col>
            </Row>
            <Row>
              <Col span={6}>Attachments</Col>
              <Col span={18} className={styles.detailColumn}>
                {this.attachmentsContent()}
              </Col>
            </Row>
            {status === REJECTED && (
              <Row>
                <Col span={6}>Request Rejection Comments</Col>
                <Col span={18} className={styles.detailColumn}>
                  <span>{comment}</span>
                </Col>
              </Row>
            )}
          </div>
        </div>

        {/* WITHDRAW REASON */}
        {Object.keys(withdraw).length !== 0 && (
          <div className={styles.requesteeDetails}>
            <div className={styles.formTitle}>
              <span className={styles.title}>Withdraw request details</span>
            </div>
            <div className={styles.formContent}>
              {/* <Row>
                <Col span={6}>Title</Col>
                <Col span={18} className={styles.detailColumn}>
                  <span className={styles.fieldValue}>{title}</span>
                </Col>
              </Row> */}
              <Row>
                <Col span={6}>Reason</Col>
                <Col span={18} className={styles.detailColumn}>
                  <span>{reason}</span>
                </Col>
              </Row>
              {status !== ON_HOLD && (
                <Row>
                  <Col span={6}>Status</Col>
                  <Col span={18} className={styles.detailColumn}>
                    <span>
                      Withdraw
                      {status === ACCEPTED && ' rejected'}
                      {status === DELETED && ' accepted'}
                    </span>
                  </Col>
                </Row>
              )}
            </div>
          </div>
        )}

        {isReject && (
          <div className={styles.rejectComment}>
            <span className={styles.title}>Request Rejection Comments</span>
            <div className={styles.content}>
              <TextArea
                onChange={this.onRejectCommentChange}
                placeholder="The reason I am rejecting this request is…"
                maxLength={500}
                autoSize={{ minRows: 3, maxRows: 7 }}
              />
            </div>
          </div>
        )}

        {/* IN PROGRESS */}
        {!isReject && status === IN_PROGRESS && isMyTicket && (
          <div className={styles.footer}>
            <span className={styles.note}>
              By default notifications will be sent to HR, your manager and recursively loop to your
              department head.
            </span>
            <div className={styles.formButtons}>
              <Button type="link" onClick={() => this.onRejectClicked()}>
                Reject
              </Button>
              <Button loading={loadingApproveRequest} onClick={() => this.onApproveClicked(_id)}>
                Approve
              </Button>
            </div>
          </div>
        )}

        {/* ACCEPTED OR REJECTED  */}
        {!isReject && (status === ACCEPTED || status === REJECTED) && (
          <div className={styles.footer}>
            <span className={styles.note}>
              By default notifications will be sent to HR, your manager and recursively loop to your
              department head.
            </span>
            <div className={styles.formButtons}>
              <Button type="link" disabled>
                {status === ACCEPTED && 'Approved'}
                {status === REJECTED && 'Rejected'}
              </Button>
            </div>
          </div>
        )}

        {/* WITHDRAW */}
        {!isReject && status === ON_HOLD && isMyTicket && (
          <div className={styles.footer}>
            <span className={styles.note}>Withdrawing an approved request</span>
            <div className={styles.formButtons}>
              <Button
                loading={loadingRejectRequest}
                type="link"
                onClick={() => this.onRejectWithdrawClicked(_id)}
              >
                Reject withdrawal
              </Button>
              <Button
                loading={loadingApproveRequest}
                onClick={() => this.onApproveWithdrawClicked(_id)}
              >
                Accept withdrawal
              </Button>
            </div>
          </div>
        )}

        {/* REJECTING  */}
        {isReject && (
          <div className={styles.footer}>
            <span className={styles.note}>
              By default notifications will be sent to HR, your manager and recursively loop to your
              department head.
            </span>
            <div className={styles.formButtons}>
              <Button type="link" onClick={this.onCancel}>
                Cancel
              </Button>
              <Button loading={loadingRejectRequest} onClick={() => this.onRejectSubmit(_id)}>
                Submit
              </Button>
            </div>
          </div>
        )}

        <TimeOffModal
          visible={showModal}
          onOk={() => this.setShowModal(false)}
          content={
            isReject
              ? 'Timeoff request has been rejected from your end. All in loop will be notified.'
              : 'Timeoff request has been approved from your end. All in loop will be notified.'
          }
          submitText="OK"
        />
        <TimeOffModal
          visible={showWithdrawModal}
          onOk={() => this.setShowWithdrawModal(false)}
          content={
            acceptWithdraw
              ? 'Withdrawing timeoff request has been approved from your end. All in loop will be notified.'
              : 'Withdrawing timeoff request has been rejected from your end. All in loop will be notified.'
          }
          submitText="OK"
        />
      </div>
    );
  }
}

export default RequestInformation;
