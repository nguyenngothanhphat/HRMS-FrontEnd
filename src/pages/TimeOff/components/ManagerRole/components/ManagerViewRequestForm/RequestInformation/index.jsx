import React, { Component } from 'react';
import { Button, Row, Col, Spin, Progress, Input } from 'antd';
import TimeOffModal from '@/components/TimeOffModal';
import { connect, history } from 'umi';
import moment from 'moment';

import styles from './index.less';

const { TextArea } = Input;

@connect(({ timeOff, loading }) => ({
  timeOff,
  loadingFetchLeaveRequestById: loading.effects['timeOff/fetchLeaveRequestById'],
  loadingWithdrawLeaveRequest: loading.effects['timeOff/withdrawLeaveRequest'],
}))
class RequestInformation extends Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      isReject: false,
      commentContent: '',
    };
  }

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
  };

  formatDurationTime = (fromDate, toDate) => {
    let leaveTimes = '';
    if (fromDate !== '' && fromDate !== null && toDate !== '' && toDate !== null) {
      leaveTimes = `${moment(fromDate).locale('en').format('MM.DD.YYYY')} - ${moment(toDate)
        .locale('en')
        .format('MM.DD.YYYY')}`;
    }
    return leaveTimes;
  };

  // ON VIEW REPORT
  onViewReport = () => {
    alert('VIEW REPORT');
  };

  // ON VIEW EMPLOYEE PROFILE
  onViewEmployeeProfile = () => {
    alert('VIEW EMPLOYEE');
  };

  // REJECT CLICKED
  onRejectClicked = () => {
    this.setState({
      isReject: true,
    });
  };

  // APPROVE CLICKED
  onApproveClicked = () => {
    console.log('APPROVED');
    this.setShowModal(true);
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
  onRejectSubmit = () => {
    console.log('REJECTED');
    this.setShowModal(true);
  };

  // ON PROCEED withDraw
  onProceed = async () => {
    const {
      timeOff: { viewingLeaveRequest: { _id: id = '', type: { name = '' } = {} } = {} } = {},
    } = this.props;
    const { dispatch } = this.props;
    const statusCode = await dispatch({
      type: 'timeOff/withdrawLeaveRequest',
      id,
    });
    if (statusCode === 200) {
      history.push({
        pathname: `/time-off`,
        state: { status: 'WITHDRAW', tickedId: '123456', typeName: name },
      });
    }
  };

  render() {
    const { showModal, isReject } = this.state;
    const { timeOff: { viewingLeaveRequest = {} } = {}, loadingFetchLeaveRequestById } = this.props;
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
                <span className={styles.fieldValue}>PSI-1224</span>
              </Col>
            </Row>
            <Row>
              <Col span={6}>Employee Name</Col>
              <Col span={18} className={styles.detailColumn}>
                <span onClick={this.onViewEmployeeProfile} className={styles.employeeLink}>
                  Siddhartha Sengupta
                </span>
              </Col>
            </Row>
            <Row>
              <Col span={6}>Position</Col>
              <Col span={18} className={styles.detailColumn}>
                <span>Senior UX designer</span>
              </Col>
            </Row>
            <Row>
              <Col span={6}>Current Project</Col>
              <Col span={18} className={styles.detailColumn}>
                <span>Intranet</span>
              </Col>
            </Row>
            <Row>
              <Col span={6}>Project Manager</Col>
              <Col span={18} className={styles.detailColumn}>
                <span onClick={this.onViewEmployeeProfile} className={styles.employeeLink}>
                  Rose Mary
                </span>
              </Col>
            </Row>
            <Row>
              <Col span={6}>Project Health</Col>
              <Col span={18} className={styles.detailColumn}>
                <div className={styles.projectHealth}>
                  <span className={styles.bar}>
                    <Progress strokeLinecap="square" strokeColor="#00C598" percent={75} />
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
            <span className={styles.title}>Leave details</span>
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
                autoSize={{ minRows: 3, maxRows: 7 }}
              />
            </div>
          </div>
        )}

        {status === 'IN-PROGRESS' && !isReject && (
          <div className={styles.footer}>
            <span className={styles.note}>
              By default notifications will be sent to HR, your manager and recursively loop to your
              department head.
            </span>
            <div className={styles.formButtons}>
              <Button type="link" onClick={() => this.onRejectClicked()}>
                Reject
              </Button>
              <Button onClick={() => this.onApproveClicked()}>Accept</Button>
            </div>
          </div>
        )}

        {status === 'IN-PROGRESS' && isReject && (
          <div className={styles.footer}>
            <span className={styles.note}>
              By default notifications will be sent to HR, your manager and recursively loop to your
              department head.
            </span>
            <div className={styles.formButtons}>
              <Button type="link" onClick={this.onCancel}>
                Cancel
              </Button>
              <Button onClick={() => this.onRejectSubmit()}>Submit</Button>
            </div>
          </div>
        )}

        <TimeOffModal
          visible={showModal}
          onClose={this.setShowModal}
          content={
            isReject
              ? 'Timeoff request has been rejected from your end. All in loop will be notified.'
              : 'Timeoff request has been approved from your end. All in loop will be notified.'
          }
          submitText="OK"
        />
      </div>
    );
  }
}

export default RequestInformation;
