import React, { Component } from 'react';
import { Button, Row, Col, Spin } from 'antd';
import EditIcon from '@/assets/editBtnBlue.svg';
import { connect } from 'umi';
import moment from 'moment';
import WithdrawModal from '../WithdrawModal';

import styles from './index.less';

@connect(({ timeOff, loading }) => ({
  timeOff,
  loadingFetchLeaveRequestById: loading.effects['timeOff/fetchLeaveRequestById'],
}))
class RequestInformation extends Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      showWithdrawModal: false,
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

  // EDIT BUTTON
  handleEdit = () => {
    // eslint-disable-next-line no-alert
    alert('EDIT');
  };

  // ON FINISH & SHOW SUCCESS MODAL WHEN CLICKING ON SUBMIT
  setShowWithdrawModal = (value) => {
    this.setState({
      showWithdrawModal: value,
    });
  };

  formatDurationTime = (from, to) => {
    return `${moment(from).locale('en').format('MM.DD.YYYY')} - ${moment(to)
      .locale('en')
      .format('MM.DD.YYYY')}`;
  };

  // WITHDRAW CLICKED
  withDraw = () => {
    this.setShowWithdrawModal(true);
  };

  // ON PROCEED withDraw
  onProceed = () => {
    alert('Proceed');
  };

  render() {
    const { showWithdrawModal } = this.state;
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
        <div className={styles.formTitle}>
          <span className={styles.title}>{`[Ticket ID : ${_id}]: ${subject}`}</span>
          <div className={styles.editButton} onClick={this.handleEdit}>
            <img src={EditIcon} className={styles.icon} alt="edit-icon" />
            <span className={styles.label}>Edit</span>
          </div>
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
                  <span>{`${name} (${shortType})`}</span>
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
                <Col span={18} className={styles.detailColumn}>
                  <span>{formatDurationTime}</span>{' '}
                  <span
                    style={{
                      fontWeight: 'bold',
                    }}
                  >
                    [{duration <= 1 ? `${duration} day` : `${duration} days`}]
                  </span>
                </Col>
              </Row>
              <Row>
                <Col span={6}>Description</Col>
                <Col span={18} className={styles.detailColumn}>
                  <span>{description}</span>
                </Col>
              </Row>
            </div>
            {status !== 'REJECTED' && (
              <div className={styles.footer}>
                <span className={styles.note}>
                  By default notifications will be sent to HR, your manager and recursively loop to
                  your department head.
                </span>
                <div className={styles.formButtons}>
                  <Button
                    // loading={loadingAddLeaveRequest}
                    onClick={this.withDraw}
                  >
                    Withdraw
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
        <WithdrawModal
          visible={showWithdrawModal}
          onProceed={this.onProceed}
          onClose={this.setShowWithdrawModal}
        />
      </div>
    );
  }
}

export default RequestInformation;
