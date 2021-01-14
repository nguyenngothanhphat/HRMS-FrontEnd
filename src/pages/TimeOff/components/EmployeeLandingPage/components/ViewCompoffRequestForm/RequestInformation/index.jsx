import React, { PureComponent } from 'react';
import { Button, Row, Col, Spin } from 'antd';
import EditIcon from '@/assets/editBtnBlue.svg';
import { connect, history } from 'umi';
import moment from 'moment';
import WithdrawModal from '../WithdrawModal';

import styles from './index.less';

@connect(({ timeOff, loading }) => ({
  timeOff,
  loadingFetchCompoffRequestById: loading.effects['timeOff/fetchCompoffRequestById'],
  loadingWithdrawLeaveRequest: loading.effects['timeOff/withdrawLeaveRequest'],
}))
class RequestInformation extends PureComponent {
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
      type: 'timeOff/fetchCompoffRequestById',
      id,
    });
  };

  // EDIT BUTTON
  handleEdit = (_id) => {
    history.push({
      pathname: `/time-off/edit-compoff-request/${_id}`,
    });
  };

  // ON FINISH & SHOW SUCCESS MODAL WHEN CLICKING ON SUBMIT
  setShowWithdrawModal = (value) => {
    this.setState({
      showWithdrawModal: value,
    });
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

  // WITHDRAW CLICKED
  withDraw = () => {
    this.setShowWithdrawModal(true);
  };

  // ON PROCEED withDraw
  onProceed = async () => {
    const {
      timeOff: { viewingCompoffRequest: { _id: id = '', ticketID = '' } = {} } = {},
    } = this.props;
    const { dispatch } = this.props;
    const statusCode = await dispatch({
      type: 'timeOff/withdrawCompoffRequest',
      id,
    });
    if (statusCode === 200) {
      history.push({
        pathname: `/time-off`,
        state: { status: 'WITHDRAW', tickedId: ticketID },
      });
    }
  };

  render() {
    const { showWithdrawModal } = this.state;
    const {
      timeOff: { viewingCompoffRequest = {} } = {},
      loadingFetchCompoffRequestById,
      loadingWithdrawLeaveRequest,
    } = this.props;

    const {
      status = '',
      ticketID = '',
      _id = '',
      extraTime = '',
      description = '',
      project: {
        name = '',
        manager: {
          employeeId: projectManagerId = '',
          generalInfo: { firstName = '', lastName = '' } = {},
        } = {},
      } = {},
    } = viewingCompoffRequest;

    const projectManagerName = `${firstName} ${lastName}`;

    const formatDurationTime = this.formatDurationTime(extraTime);

    return (
      <div className={styles.RequestInformation}>
        <div className={styles.formTitle}>
          <span className={styles.title}>{`[Ticket ID: ${ticketID}]`}</span>
          {(status === 'DRAFTS' || status === 'IN-PROGRESS') && (
            <div className={styles.editButton} onClick={() => this.handleEdit(_id)}>
              <img src={EditIcon} className={styles.icon} alt="edit-icon" />
              <span className={styles.label}>Edit</span>
            </div>
          )}
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
                  <span className={styles.fieldValue}>{name}</span>
                  <div className={styles.smallNotice}>
                    <span className={styles.normalText}>
                      Managed by [{projectManagerId}] - {projectManagerName}
                    </span>
                  </div>
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
                <Col span={6}>Description</Col>
                <Col span={18} className={styles.detailColumn}>
                  <span>{description}</span>
                </Col>
              </Row>
            </div>
            {(status === 'DRAFTS' || status === 'IN-PROGRESS') && (
              <div className={styles.footer}>
                <span className={styles.note}>
                  By default notifications will be sent to HR, your manager and recursively loop to
                  your department head.
                </span>
                <div className={styles.formButtons}>
                  <Button onClick={() => this.withDraw()}>Withdraw</Button>
                </div>
              </div>
            )}
          </>
        )}
        <WithdrawModal
          loading={loadingWithdrawLeaveRequest}
          visible={showWithdrawModal}
          onProceed={this.onProceed}
          onClose={this.setShowWithdrawModal}
        />
      </div>
    );
  }
}

export default RequestInformation;
