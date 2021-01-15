import React, { PureComponent } from 'react';
import { Button, Row, Col, Spin, Progress, Input } from 'antd';
import TimeOffModal from '@/components/TimeOffModal';
import { connect, history } from 'umi';
import moment from 'moment';

import styles from './index.less';

const { TextArea } = Input;

@connect(({ timeOff, loading, timeOff: { currentUserRole = '' } = {} }) => ({
  timeOff,
  currentUserRole,
  loadingFetchCompoffRequestById: loading.effects['timeOff/fetchCompoffRequestById'],
}))
class RequestInformation extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      isReject: false,
      commentContent: '',
    };
  }

  refreshPage = () => {
    setTimeout(() => {
      window.location.reload(false);
    }, 500);
  };

  // FETCH LEAVE REQUEST DETAIL
  componentDidMount = () => {
    const { dispatch, id = '' } = this.props;
    dispatch({
      type: 'timeOff/fetchLeaveRequestById',
      id,
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

  formatDurationTime = (extraTime) => {
    let fromDate = '';
    let toDate = '';
    if (extraTime.length !== 0) {
      fromDate = extraTime[0].date;
      toDate = extraTime[extraTime.length - 1].date;
    }

    let leaveTimes = '';
    if (fromDate !== '' && fromDate !== null && toDate !== '' && toDate !== null) {
      leaveTimes = `${moment(fromDate).locale('en').format('DD.MM.YYYY')} - ${moment(toDate)
        .locale('en')
        .format('DD.MM.YYYY')}`;
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
      type: 'timeOff/approveCompoffRequest',
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
      type: 'timeOff/rejectCompoffRequest',
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

  render() {
    const { showModal, isReject } = this.state;
    const {
      timeOff: { viewingCompoffRequest = {} } = {},
      loadingFetchCompoffRequestById,
      loadingApproveRequest,
      loadingRejectRequest,
      currentUserRole,
    } = this.props;
    const {
      status = '',
      _id = '',
      employee: {
        generalInfo: { firstName = '', lastName = '' } = {},
        employeeId = '',
        position: { name: position = '' } = {},
      } = {},
      extraTime = [],
      description = '',
      project: {
        name = '',
        manager: {
          _id: managerId = '',
          generalInfo: { firstName: firstName1 = '', lastName: lastName1 = '' } = {},
        } = {},
        projectHealth = 0,
      } = {},
      currentStep = 0,
      commentPM = '',
      commentCLA = '',
    } = viewingCompoffRequest;

    const projectManagerName = `${firstName1} ${lastName1}`;

    const formatDurationTime = this.formatDurationTime(extraTime);

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
            <Row>
              <Col span={6}>Current Project</Col>
              <Col span={18} className={styles.detailColumn}>
                <span>{name}</span>
              </Col>
            </Row>
            <Row>
              <Col span={6}>Project Manager</Col>
              <Col span={18} className={styles.detailColumn}>
                <span
                  onClick={() => this.onViewEmployeeProfile(managerId)}
                  className={styles.employeeLink}
                >
                  {projectManagerName}
                </span>
              </Col>
            </Row>
            <Row>
              <Col span={6}>Project Health</Col>
              <Col span={18} className={styles.detailColumn}>
                <div className={styles.projectHealth}>
                  <span className={styles.bar}>
                    <Progress
                      strokeLinecap="square"
                      strokeColor="#00C598"
                      percent={projectHealth}
                    />
                  </span>
                  <span className={styles.viewReport} onClick={this.onViewReport}>
                    View Report
                  </span>
                </div>
              </Col>
            </Row>
          </div>
        </div>

        <div className={styles.requesteeDetails}>
          <div className={styles.formTitle}>
            <span className={styles.title}>Compoff request details</span>
          </div>
          {loadingFetchCompoffRequestById && (
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
          {!loadingFetchCompoffRequestById && (
            <>
              <div className={styles.formContent}>
                <Row>
                  <Col span={6}>Project</Col>
                  <Col span={18} className={styles.detailColumn}>
                    <span className={styles.fieldValue}>{`${name}`}</span>
                  </Col>
                </Row>
                <Row>
                  <Col span={6}>Duration</Col>
                  {formatDurationTime !== '' && (
                    <>
                      <Col span={18} className={styles.detailColumn}>
                        <span>{formatDurationTime}</span>{' '}
                      </Col>
                    </>
                  )}
                </Row>
                <Row>
                  <Col span={6}>Extra time spent</Col>
                  <Col span={18} className={styles.detailColumn}>
                    <div className={styles.extraTimeSpent}>
                      <Row className={styles.header}>
                        <Col span={7}>Date</Col>
                        <Col span={7}>Day</Col>
                        <Col span={10}>Time Spent (In Hrs)</Col>
                      </Row>

                      <div className={styles.content}>
                        {extraTime.map((day, index) => {
                          const { date = '', timeSpend = 0 } = day;
                          return (
                            <Row
                              key={`${index + 1}`}
                              justify="center"
                              align="center"
                              className={styles.rowContainer}
                            >
                              <Col span={7}>{moment(date).locale('en').format('DD.MM.YYYY')}</Col>
                              <Col span={7}>{moment(date).locale('en').format('dddd')}</Col>
                              <Col span={7}>
                                <Input
                                  disabled
                                  placeholder="0"
                                  suffix="Hrs"
                                  defaultValue={timeSpend}
                                />
                              </Col>
                              <Col span={3} />
                            </Row>
                          );
                        })}
                      </div>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col span={6}>Description</Col>
                  <Col span={18} className={styles.detailColumn}>
                    <span>{description}</span>
                  </Col>
                </Row>
                {status === 'REJECTED' && currentStep === 2 && (
                  <Row>
                    <Col span={6}>Request Rejection Comments (Project Manager)</Col>
                    <Col span={18} className={styles.detailColumn}>
                      <span>{commentPM}</span>
                    </Col>
                  </Row>
                )}
                {status === 'REJECTED' && currentStep > 2 && (
                  <Row>
                    <Col span={6}>Request Rejection Comments (Region Head)</Col>
                    <Col span={18} className={styles.detailColumn}>
                      <span>{commentCLA}</span>
                    </Col>
                  </Row>
                )}
              </div>
            </>
          )}
        </div>

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
        {!isReject &&
          (status === 'IN-PROGRESS' ||
            (currentUserRole === 'ADMIN-CLA' && status === 'IN-PROGRESS-NEXT')) && (
            <div className={styles.footer}>
              <span className={styles.note}>
                By default notifications will be sent to HR, your manager and recursively loop to
                your department head.
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
        {!isReject &&
          (status === 'ACCEPTED' ||
            (currentUserRole !== 'ADMIN-CLA' && status === 'IN-PROGRESS-NEXT') ||
            status === 'REJECTED') && (
            <div className={styles.footer}>
              <span className={styles.note}>
                By default notifications will be sent to HR, your manager and recursively loop to
                your department head.
              </span>
              <div className={styles.formButtons}>
                <Button type="link" disabled>
                  {(status === 'ACCEPTED' ||
                    (currentUserRole !== 'ADMIN-CLA' && status === 'IN-PROGRESS-NEXT')) &&
                    'Approved'}
                  {status === 'REJECTED' && 'Rejected'}
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
              ? 'Compoff request has been rejected from your end. All in loop will be notified.'
              : 'Compoff request has been approved from your end. All in loop will be notified.'
          }
          submitText="OK"
        />
      </div>
    );
  }
}

export default RequestInformation;
