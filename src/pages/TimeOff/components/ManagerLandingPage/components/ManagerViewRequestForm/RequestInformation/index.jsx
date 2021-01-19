import React, { PureComponent } from 'react';
import { Button, Row, Col, Spin, Input } from 'antd';
import TimeOffModal from '@/components/TimeOffModal';
import { connect, history } from 'umi';
import moment from 'moment';
import Project from './components/Project';

import styles from './index.less';

const { TextArea } = Input;

@connect(({ timeOff, loading }) => ({
  timeOff,
  loadingFetchLeaveRequestById: loading.effects['timeOff/fetchLeaveRequestById'],
  loadingWithdrawLeaveRequest: loading.effects['timeOff/withdrawLeaveRequest'],
  loadingApproveRequest: loading.effects['timeOff/reportingManagerApprove'],
  loadingRejectRequest: loading.effects['timeOff/reportingManagerReject'],
  loadingManagerApproveWithdrawRequest: loading.effects['timeOff/managerApproveWithdrawRequest'],
  loadingManagerRejectWithdrawRequest: loading.effects['timeOff/managerRejectWithdrawRequest'],
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

  // FETCH LEAVE REQUEST DETAIL
  componentDidMount = () => {
    const { dispatch, employeeId = '' } = this.props;
    dispatch({
      type: 'timeOff/fetchProjectsListByEmployee',
      payload: { employee: employeeId },
    });
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

  formatDurationTime = (fromDate, toDate) => {
    let leaveTimes = '';
    if (fromDate !== '' && fromDate !== null && toDate !== '' && toDate !== null) {
      leaveTimes = `${moment(fromDate).locale('en').format('DD.MM.YY')} - ${moment(toDate)
        .locale('en')
        .format('DD.MM.YY')}`;
    }
    return leaveTimes;
  };

  // ON VIEW REPORT
  onViewReport = () => {
    // eslint-disable-next-line no-alert
    alert('VIEW REPORT');
  };

  // ON VIEW EMPLOYEE PROFILE
  onViewEmployeeProfile = (_id) => {
    history.push({
      pathname: `/directory/employee-profile/${_id}`,
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
      type: 'timeOff/reportingManagerApprove',
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
      type: 'timeOff/reportingManagerReject',
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
      type: 'timeOff/managerApproveWithdrawRequest',
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
      type: 'timeOff/managerRejectWithdrawRequest',
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

  render() {
    const { showModal, showWithdrawModal, isReject, acceptWithdraw } = this.state;
    const {
      timeOff: { viewingLeaveRequest = {}, projectsList = [] } = {},
      loadingFetchLeaveRequestById,
      loadingApproveRequest,
      loadingRejectRequest,
      loadingManagerApproveWithdrawRequest,
      loadingManagerRejectWithdrawRequest,
      loadingFetchProjectsOfEmployee,
    } = this.props;
    const {
      status = '',
      _id = '',
      subject = '',
      fromDate = '',
      toDate = '',
      duration = '',
      // onDate = '',
      description = '',
      type: { name = '', shortType = '' } = {},
      employee: {
        generalInfo: { firstName = '', lastName = '' } = {},
        employeeId = '',
        position: { name: position = '' } = {},
      } = {},
      comment = '',
      withdraw: {
        //  title = '',
        reason = '',
      } = {},
      withdraw = {},
    } = viewingLeaveRequest;

    const formatDurationTime = this.formatDurationTime(fromDate, toDate);

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
                <span className={styles.fieldValue}>{employeeId}</span>
              </Col>
            </Row>
            <Row>
              <Col span={6}>Employee Name</Col>
              <Col span={18} className={styles.detailColumn}>
                <span
                  onClick={() => this.onViewEmployeeProfile(_id)}
                  className={styles.employeeLink}
                >
                  {`${firstName} ${lastName}`}
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
                <Col span={6}>Current Project</Col>
                <Col span={6}>Project Manager</Col>
                <Col span={12}>Project Health</Col>
              </Row>
              {loadingFetchProjectsOfEmployee && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    padding: '50px 0',
                  }}
                >
                  <Spin size="medium" />
                </div>
              )}
              {!loadingFetchProjectsOfEmployee && (
                <>
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
                      {projectsList.map((project) => {
                        const {
                          _id: pjManagerId = '',
                          name: prName = '',
                          manager: {
                            generalInfo: { firstName: fn = '', lastName: ln = '' } = {},
                          } = {},
                          projectHealth = 0,
                        } = project;
                        return (
                          <>
                            <Project
                              name={prName}
                              projectManager={`${fn} ${ln}`}
                              projectHealth={projectHealth}
                              employeeId={pjManagerId}
                            />
                            {/* {index + 1 < projects.length && <div className={styles.divider} />} */}
                          </>
                        );
                      })}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <div className={styles.requesteeDetails}>
          <div className={styles.formTitle}>
            <span className={styles.title}>Timeoff request details</span>
          </div>
          {loadingFetchLeaveRequestById && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '100px 0',
              }}
            >
              <Spin size="medium" />
            </div>
          )}
          {!loadingFetchLeaveRequestById && (
            <>
              <div className={styles.formContent}>
                <Row>
                  <Col span={6}>Timeoff Type</Col>
                  <Col span={18} className={styles.detailColumn}>
                    <span className={styles.fieldValue}>{`${name} (${shortType})`}</span>
                  </Col>
                </Row>
                <Row>
                  <Col span={6}>Subject</Col>
                  <Col span={18} className={styles.detailColumn}>
                    <span>{subject}</span>
                  </Col>
                </Row>
                <Row>
                  <Col span={6}>Duration</Col>
                  {formatDurationTime !== '' && (
                    <>
                      <Col span={18} className={styles.detailColumn}>
                        <span>{formatDurationTime}</span>{' '}
                        <span
                          style={{
                            fontWeight: 'bold',
                          }}
                          className={styles.fieldValue}
                        >
                          [{duration <= 1 ? `${duration} day` : `${duration} days`}]
                        </span>
                      </Col>
                    </>
                  )}
                </Row>
                <Row>
                  <Col span={6}>Description</Col>
                  <Col span={18} className={styles.detailColumn}>
                    <span>{description}</span>
                  </Col>
                </Row>
                {status === 'REJECTED' && (
                  <Row>
                    <Col span={6}>Request Rejection Comments</Col>
                    <Col span={18} className={styles.detailColumn}>
                      <span>{comment}</span>
                    </Col>
                  </Row>
                )}
              </div>
            </>
          )}
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
              {status !== 'ON-HOLD' && (
                <Row>
                  <Col span={6}>Status</Col>
                  <Col span={18} className={styles.detailColumn}>
                    <span>
                      {status === 'ACCEPTED' && 'Rejected'}
                      {status === 'DELETED' && 'Accepted'}
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
        {!isReject && status === 'IN-PROGRESS' && (
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
                Accept
              </Button>
            </div>
          </div>
        )}

        {/* ACCEPTED OR REJECTED  */}
        {!isReject && (status === 'ACCEPTED' || status === 'REJECTED') && (
          <div className={styles.footer}>
            <span className={styles.note}>
              By default notifications will be sent to HR, your manager and recursively loop to your
              department head.
            </span>
            <div className={styles.formButtons}>
              <Button type="link" disabled>
                {status === 'ACCEPTED' && 'Approved'}
                {status === 'REJECTED' && 'Rejected'}
              </Button>
            </div>
          </div>
        )}

        {/* WITHDRAW */}
        {!isReject && status === 'ON-HOLD' && (
          <div className={styles.footer}>
            <span className={styles.note}>Withdrawing an approved request</span>
            <div className={styles.formButtons}>
              <Button
                loading={loadingManagerRejectWithdrawRequest}
                type="link"
                onClick={() => this.onRejectWithdrawClicked(_id)}
              >
                Reject
              </Button>
              <Button
                loading={loadingManagerApproveWithdrawRequest}
                onClick={() => this.onApproveWithdrawClicked(_id)}
              >
                Withdraw
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
