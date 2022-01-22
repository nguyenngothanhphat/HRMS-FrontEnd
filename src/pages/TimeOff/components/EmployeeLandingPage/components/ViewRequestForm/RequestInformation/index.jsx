import React, { PureComponent } from 'react';
import { Button, Row, Col, Spin, notification } from 'antd';
import { connect, history } from 'umi';
import moment from 'moment';
import EditIcon from '@/assets/editBtnBlue.svg';
import { TIMEOFF_STATUS } from '@/utils/timeOff';
import ViewDocumentModal from '@/components/ViewDocumentModal';
import WithdrawModal from '../WithdrawModal';
import Withdraw2Modal from '../Withdraw2Modal';
import styles from './index.less';

const { IN_PROGRESS, ACCEPTED, REJECTED, DRAFTS } = TIMEOFF_STATUS;
@connect(({ timeOff, loading }) => ({
  timeOff,
  loadingFetchLeaveRequestById: loading.effects['timeOff/fetchLeaveRequestById'],
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
      viewDocumentModal: false,
    };
  }

  // view policy modal
  setViewDocumentModal = (value) => {
    this.setState({
      viewDocumentModal: value,
    });
  };

  // on policy link clicked
  onLinkClick = () => {
    this.setViewDocumentModal(true);
  };

  refreshPage = () => {
    setTimeout(() => {
      window.location.reload(false);
    }, 1000);
  };

  // EDIT BUTTON
  handleEdit = (_id) => {
    history.push({
      pathname: `/time-off/overview/personal-timeoff/edit/${_id}`,
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
      leaveTimes = `${moment.utc(fromDate).locale('en').format('MM/DD/YYYY')} - ${moment
        .utc(toDate)
        .locale('en')
        .format('MM/DD/YYYY')}`;
    }
    return leaveTimes;
  };

  // WITHDRAW CLICKED
  withDraw = (status) => {
    if (status !== ACCEPTED) this.setShowWithdrawModal(true);
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
      history.push({
        pathname: `/time-off`,
        state: { status: 'WITHDRAW', tickedId: ticketID, typeName: name, category: 'TIMEOFF' },
      });
    }
  };

  onProceedDrafts = async () => {
    const {
      timeOff: {
        viewingLeaveRequest: { _id = '', ticketID = '', type: { name = '' } = {} } = {},
        // currentLeaveTypeTab = '1',
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
        state: { status: 'WITHDRAW', tickedId: ticketID, typeName: name, category: 'DRAFTS' },
      });
      // dispatch({
      //   type: 'timeOff/save',
      //   payload: {
      //     currentMineOrTeamTab: '2',
      //     currentFilterTab: '1',
      //     currentLeaveTypeTab,
      //   },
      // });
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
    const now = moment.utc().format('YYYY-MM-DD');
    const from = moment.utc(fromDate).format('YYYY-MM-DD');
    return from > now;
  };

  render() {
    const { showWithdrawModal, showWithdraw2Modal, viewDocumentModal } = this.state;
    const {
      timeOff: { viewingLeaveRequest = {} } = {},
      loadingFetchLeaveRequestById,
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
      type: { name = '', type = '' } = {},
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
          {(status === DRAFTS || status === IN_PROGRESS) && (
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
              <Row align="middle" gutter={[0, 12]}>
                <Col span={6}>Timeoff Type</Col>
                <Col span={18} className={styles.detailColumn}>
                  <span className={styles.fieldValue}>{`${name}`}</span>
                  {type === 'A' && (
                    <span className={styles.smallNotice}>
                      <span className={styles.normalText}>
                        {name}s are covered under{' '}
                        <span className={styles.link} onClick={this.onLinkClick}>
                          Standard Policy
                        </span>
                      </span>
                    </span>
                  )}
                </Col>

                <Col span={6}>Subject</Col>
                <Col span={18} className={styles.detailColumn}>
                  <span>{subject}</span>
                </Col>

                <Col span={6}>Duration</Col>
                {formatDurationTime ? (
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
                ) : (
                  <Col span={18} />
                )}

                <Col span={6}>Description</Col>
                <Col span={18} className={styles.detailColumn}>
                  <span>{description}</span>
                </Col>

                {status === REJECTED && (
                  <>
                    <Col span={6}>Request Rejection Comments</Col>
                    <Col span={18} className={styles.detailColumn}>
                      <span>{comment}</span>
                    </Col>
                  </>
                )}
              </Row>
            </div>
            {(status === DRAFTS ||
              status === IN_PROGRESS ||
              (status === ACCEPTED && checkWithdrawValid)) && (
              <div className={styles.footer}>
                <span className={styles.note}>
                  By default notifications will be sent to HR, your manager and recursively loop to
                  your department head.
                </span>
                <div className={styles.formButtons}>
                  <Button onClick={() => this.withDraw(status)}>
                    {status === DRAFTS ? 'Discard' : 'Withdraw'}
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
        <WithdrawModal
          loading={loadingEmployeeWithdrawInProgress}
          visible={showWithdrawModal}
          onProceed={status === IN_PROGRESS ? this.onProceedInProgress : this.onProceedDrafts}
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
        <ViewDocumentModal visible={viewDocumentModal} onClose={this.setViewDocumentModal} />
      </div>
    );
  }
}

export default RequestInformation;
