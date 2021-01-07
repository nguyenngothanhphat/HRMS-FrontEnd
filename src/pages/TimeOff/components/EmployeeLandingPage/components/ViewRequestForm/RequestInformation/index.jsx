import React, { PureComponent } from 'react';
import { Button, Row, Col, Spin, notification } from 'antd';
import EditIcon from '@/assets/editBtnBlue.svg';
import { connect, history } from 'umi';
import moment from 'moment';
import WithdrawModal from '../WithdrawModal';
import Withdraw2Modal from '../Withdraw2Modal';
import styles from './index.less';

@connect(({ timeOff, loading }) => ({
  timeOff,
  loadingFetchLeaveRequestById: loading.effects['timeOff/fetchLeaveRequestById'],
  loadingRemoveLeaveRequestOnDatabase: loading.effects['timeOff/removeLeaveRequestOnDatabase'],
  loadingEmployeeWithdrawInProgress: loading.effects['timeOff/employeeWithdrawInProgress'],
  loadingEmployeeWithdrawApproved: loading.effects['timeOff/employeeWithdrawApproved'],
}))
class RequestInformation extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      showWithdrawModal: false,
      showWithdraw2Modal: false,
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

  refreshPage = () => {
    setTimeout(() => {
      window.location.reload(false);
    }, 3000);
  };

  // EDIT BUTTON
  handleEdit = (_id) => {
    history.push({
      pathname: `/time-off/edit-leave-request/${_id}`,
    });
  };

  // ON FINISH & SHOW SUCCESS MODAL WHEN CLICKING ON SUBMIT
  setShowWithdrawModal = (value) => {
    this.setState({
      showWithdrawModal: value,
    });
  };

  setShowWithdraw2Modal = (value) => {
    this.setState({
      showWithdraw2Modal: value,
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

  // WITHDRAW CLICKED
  withDraw = (status) => {
    if (status !== 'ACCEPTED') this.setShowWithdrawModal(true);
    else this.setShowWithdraw2Modal(true);
  };

  // ON WITHDRAW WHEN A TICKET IS DRAFT OR IN PROGRESS
  onProceedInProgress = async () => {
    const {
      timeOff: {
        viewingLeaveRequest: { _id = '', ticketID = '', type: { name = '' } = {} } = {},
      } = {},
    } = this.props;
    const { dispatch } = this.props;
    const statusCode = await dispatch({
      type: 'timeOff/employeeWithdrawInProgress',
      payload: { _id },
    });
    if (statusCode === 200) {
      dispatch({
        type: 'timeOff/removeLeaveRequestOnDatabase',
        payload: { id: _id },
      }).then(() => {
        history.push({
          pathname: `/time-off`,
          state: { status: 'WITHDRAW', tickedId: ticketID, typeName: name },
        });
      });
    }
  };

  onProceedDrafts = async () => {
    const {
      timeOff: {
        viewingLeaveRequest: { _id = '', ticketID = '', type: { name = '' } = {} } = {},
      } = {},
    } = this.props;
    const { dispatch } = this.props;
    const statusCode = await dispatch({
      type: 'timeOff/removeLeaveRequestOnDatabase',
      id: _id,
    });
    if (statusCode === 200) {
      history.push({
        pathname: `/time-off`,
        state: { status: 'WITHDRAW', tickedId: ticketID, typeName: name },
      });
    }
  };

  // ON WITHDRAW WHEN A TICKET WAS APPROVED
  onProceedApproved = async (title, reason) => {
    const { timeOff: { viewingLeaveRequest: { _id = '' } = {} } = {} } = this.props;
    const { dispatch } = this.props;
    const statusCode = await dispatch({
      type: 'timeOff/employeeWithdrawApproved',
      payload: { _id, title, reason },
    });
    if (statusCode === 200) {
      notification.success({
        message: 'Withdraw request sent!',
      });
      this.setShowWithdraw2Modal(false);
      this.refreshPage();
    }
  };

  checkWithdrawValid = (fromDate) => {
    const now = moment().format('YYYY-MM-DD');
    const from = moment(fromDate).format('YYYY-MM-DD');
    return from > now;
  };

  render() {
    const { showWithdrawModal, showWithdraw2Modal } = this.state;
    const {
      timeOff: { viewingLeaveRequest = {} } = {},
      loadingFetchLeaveRequestById,
      loadingRemoveLeaveRequestOnDatabase,
      loadingEmployeeWithdrawInProgress,
      loadingEmployeeWithdrawApproved,
    } = this.props;
    const {
      ticketID = '',
      status = '',
      _id = '',
      subject = '',
      fromDate = '',
      toDate = '',
      duration = '',
      // onDate = '',
      description = '',
      type: { name = '', type = '', shortType = '' } = {},
      comment = '',
    } = viewingLeaveRequest;

    const formatDurationTime = this.formatDurationTime(fromDate, toDate);

    const checkWithdrawValid = this.checkWithdrawValid(fromDate);

    return (
      <div className={styles.RequestInformation}>
        <div className={styles.formTitle}>
          <span className={styles.title}>
            [Ticket ID: {ticketID}]: {subject}
          </span>
          {(status === 'DRAFTS' || status === 'IN-PROGRESS') && (
            <div className={styles.editButton} onClick={() => this.handleEdit(_id)}>
              <img src={EditIcon} className={styles.icon} alt="edit-icon" />
              <span className={styles.label}>Edit</span>
            </div>
          )}
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
                  <span className={styles.smallNotice}>
                    <span className={styles.normalText}>
                      {shortType}s are covered under{' '}
                      <span className={styles.link}>Standard Policy</span>
                    </span>
                  </span>
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
                      {(type === 'A' || type === 'B') && (
                        <span className={styles.smallNotice}>
                          <span className={styles.normalText}>
                            {name}s gets credited each month.
                          </span>
                        </span>
                      )}
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
            {(status === 'DRAFTS' ||
              status === 'IN-PROGRESS' ||
              (status === 'ACCEPTED' && checkWithdrawValid)) && (
              <div className={styles.footer}>
                <span className={styles.note}>
                  By default notifications will be sent to HR, your manager and recursively loop to
                  your department head.
                </span>
                <div className={styles.formButtons}>
                  <Button onClick={() => this.withDraw(status)}>
                    {status === 'DRAFTS' ? 'Discard' : 'Withdraw'}
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
        <WithdrawModal
          loading={loadingEmployeeWithdrawInProgress || loadingRemoveLeaveRequestOnDatabase}
          visible={showWithdrawModal}
          onProceed={status === 'IN-PROGRESS' ? this.onProceedInProgress : this.onProceedDrafts}
          onClose={this.setShowWithdrawModal}
          status={status}
        />
        <Withdraw2Modal
          loading={loadingEmployeeWithdrawApproved}
          visible={showWithdraw2Modal}
          onProceed={this.onProceedApproved}
          onClose={this.setShowWithdraw2Modal}
          status={status}
        />
      </div>
    );
  }
}

export default RequestInformation;
