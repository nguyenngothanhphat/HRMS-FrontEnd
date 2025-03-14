import { Col, Row, Tag } from 'antd';
import { isEmpty } from 'lodash';
import moment from 'moment';
import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import ArrowDownIcon from '@/assets/arrowDownCollapseIcon.svg';
import EditIcon from '@/assets/editBtnBlue.svg';
import PDFIcon from '@/assets/pdf_icon.png';
import CustomPrimaryButton from '@/components/CustomPrimaryButton';
import ViewDocumentModal from '@/components/ViewDocumentModal';
import { DATE_FORMAT_MDY, DATE_FORMAT_YMD } from '@/constants/dateFormat';
import { TIMEOFF_STATUS, TIMEOFF_TYPE } from '@/constants/timeOff';
import {
  checkNormalTypeTimeoff,
  isNewRequest,
  isUpdatedRequest,
  roundNumber
} from '@/utils/timeOff';
import Withdraw2Modal from '../Withdraw2Modal';
import WithdrawModal from '../WithdrawModal';
import styles from './index.less';

const { IN_PROGRESS, ACCEPTED, REJECTED, DRAFTS } = TIMEOFF_STATUS;
const { A, B } = TIMEOFF_TYPE;
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
      isShowMore: false,
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
      leaveTimes = `${moment(fromDate).locale('en').format(DATE_FORMAT_MDY)} - ${moment(toDate)
        .locale('en')
        .format(DATE_FORMAT_MDY)}`;
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
    }
  };

  // ON WITHDRAW WHEN A TICKET WAS APPROVED
  onProceedApproved = async (title, reason) => {
    const {
      timeOff: {
        viewingLeaveRequest: { _id = '', ticketID = '', type: { name = '' } = {} } = {},
      } = {},
    } = this.props;
    const { dispatch } = this.props;
    const statusCode = await dispatch({
      type: 'timeOff/employeeWithdrawApproved',
      payload: { _id, title, reason },
    });
    if (statusCode === 200) {
      history.push({
        pathname: `/time-off`,
        state: { status: 'WITHDRAW', tickedId: ticketID, typeName: name, category: 'APPROVED' },
      });
    }
  };

  checkWithdrawValid = (fromDate) => {
    const now = moment().format(DATE_FORMAT_YMD);
    const from = moment(fromDate).format(DATE_FORMAT_YMD);
    return from > now;
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
    const { showWithdrawModal, showWithdraw2Modal, viewDocumentModal, isShowMore } = this.state;
    const {
      timeOff: {
        viewingLeaveRequest = {},
        viewingLeaveRequest: { type: { type: leaveType = '' } = {} } = {},
      } = {},
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
      duration: durationProp = '',
      onDate = '',
      description = '',
      type: { name = '', type = '' } = {},
      comment = '',
      leaveDates = [],
      updated = false,
    } = viewingLeaveRequest;

    const formatDurationTime = this.formatDurationTime(fromDate, toDate);
    const listTime = leaveDates.map((x) => moment(x.date).format(DATE_FORMAT_MDY));

    const checkWithdrawValid =
      status === IN_PROGRESS ||
      (status === ACCEPTED &&
        this.checkWithdrawValid(fromDate || moment(leaveDates[0]?.date, DATE_FORMAT_YMD)));

    const duration = roundNumber(durationProp);
    const isUpdated = isUpdatedRequest(status, updated);
    const isNew = isNewRequest(status, onDate);

    return (
      <div className={styles.RequestInformation}>
        <div className={styles.formTitle}>
          <span className={styles.title}>
            <span className={styles.ticketID}>
              {`[Ticket ID: ${ticketID}]: ${subject}`}
            </span>
            {isUpdated && <Tag color="#2C6DF9">Updated</Tag>}
            {isNew && !isUpdated && <Tag color="#2C6DF9">New</Tag>}
          </span>
          {(status === DRAFTS || status === IN_PROGRESS) && (
            <div className={styles.editButton} onClick={() => this.handleEdit(_id)}>
              <img src={EditIcon} className={styles.icon} alt="edit-icon" />
              <span className={styles.label}>Edit</span>
            </div>
          )}
        </div>

        <div className={styles.formContent}>
          <Row align="middle" gutter={[24, 16]}>
            <Col span={6}>Timeoff Type</Col>
            <Col span={18} className={styles.detailColumn}>
              <span className={styles.fieldValue}>{`${name}`}</span>
              {type === A && (
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
            {formatDurationTime || listTime ? (
              <>
                <Col span={18} className={styles.detailColumn}>
                  {formatDurationTime && !checkNormalTypeTimeoff(leaveType) ? (
                    <span>{formatDurationTime}</span>
                  ) : (
                    <>
                      {listTime.length > 4 && !isShowMore ? (
                        <span>
                          {listTime.slice(0, 4).join(' | ')}
                          <span
                            style={{
                              color: '#2c6df9',
                              fontWeight: 700,
                              cursor: 'pointer',
                              paddingLeft: 10,
                            }}
                            onClick={() => this.setState({ isShowMore: true })}
                          >
                            View More
                            <img
                              style={{ margin: '0 4px' }}
                              src={ArrowDownIcon}
                              alt="arrow-down-icon"
                            />
                          </span>
                        </span>
                      ) : (
                        listTime.join(' | ')
                      )}
                    </>
                  )}
                  <span
                    style={{
                      fontWeight: 'bold',
                      marginLeft: 3,
                    }}
                    className={styles.fieldValue}
                  >
                    [{duration <= 1 ? `${duration} day` : `${duration} days`}]
                  </span>
                  {(type === A || type === B) && (
                    <span className={styles.smallNotice}>
                      <span className={styles.normalText}>{name}s gets credited each month.</span>
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

            <Col span={6}>Attachments</Col>
            <Col span={18} className={styles.detailColumn}>
              {this.attachmentsContent()}
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
          (status === IN_PROGRESS && checkWithdrawValid) ||
          (status === ACCEPTED && checkWithdrawValid)) && (
          <div className={styles.footer}>
            <span className={styles.note}>
              By default notifications will be sent to HR, your manager and recursively loop to your
              department head.
            </span>
            <div className={styles.formButtons}>
              <CustomPrimaryButton onClick={() => this.withDraw(status)}>
                {status === DRAFTS ? 'Discard' : 'Withdraw'}
              </CustomPrimaryButton>
            </div>
          </div>
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
