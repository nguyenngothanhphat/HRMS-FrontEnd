import React, { PureComponent } from 'react';
import { Button, Row, Col, Spin, Input } from 'antd';
import EditIcon from '@/assets/editBtnBlue.svg';
import { connect, history } from 'umi';
import { TIMEOFF_STATUS, TIMEOFF_LINK_ACTION } from '@/utils/timeOff';
import moment from 'moment';
import WithdrawModal from '../WithdrawModal';

import styles from './index.less';

@connect(({ timeOff, loading }) => ({
  timeOff,
  loadingFetchCompoffRequestById: loading.effects['timeOff/fetchCompoffRequestById'],
  loadingWithdrawLeaveRequest: loading.effects['timeOff/withdrawCompoffRequest'],
}))
class RequestInformation extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      showWithdrawModal: false,
    };
  }

  // EDIT BUTTON
  handleEdit = (_id) => {
    history.push({
      pathname: `/time-off/overview/personal-compoff/${TIMEOFF_LINK_ACTION.editCompoffRequest}/${_id}`,
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
      leaveTimes = `${moment(fromDate).locale('en').format('MM.DD.YY')} - ${moment(toDate)
        .locale('en')
        .format('MM.DD.YY')}`;
    }
    return leaveTimes;
  };

  // WITHDRAW CLICKED
  withDraw = () => {
    this.setShowWithdrawModal(true);
  };

  // ON PROCEED withDraw
  onProceed = async () => {
    const { timeOff: { viewingCompoffRequest: { _id: id = '', ticketID = '' } = {} } = {} } =
      this.props;
    const { dispatch } = this.props;
    const statusCode = await dispatch({
      type: 'timeOff/withdrawCompoffRequest',
      id,
    });
    if (statusCode === 200) {
      history.push({
        pathname: `/time-off`,
        state: { status: 'WITHDRAW', tickedId: ticketID, category: 'COMPOFF' },
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
      extraTime = [],
      description = '',
      project: {
        name = '',
        manager: {
          employeeId: projectManagerId = '',
          generalInfo: { firstName = '', lastName = '' } = {},
        } = {},
      } = {},
      commentPM = '',
      commentCLA = '',
      currentStep = 0,
      totalHours = 0,
    } = viewingCompoffRequest;

    const projectManagerName = `${firstName} ${lastName}`;

    const formatDurationTime = this.formatDurationTime(extraTime);

    return (
      <div className={styles.RequestInformation}>
        <div className={styles.formTitle}>
          <span className={styles.title}>{`[Ticket ID: ${ticketID}]`}</span>
          {(status === TIMEOFF_STATUS.drafts || status === TIMEOFF_STATUS.inProgress) && (
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
                            <Col span={7}>{moment(date).locale('en').format('MM.DD.YY')}</Col>
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
                    <div className={styles.totalHours}>
                      <Row>
                        <Col span={7}>
                          Total:{' '}
                          <span style={{ fontWeight: 'bold' }}>
                            {totalHours} hours ({parseFloat(totalHours / 24).toFixed(2)} days)
                          </span>
                        </Col>
                        <Col span={7} />
                        <Col span={10} />
                      </Row>
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
              {status === TIMEOFF_STATUS.rejected && currentStep === 2 && (
                <Row>
                  <Col span={6}>Request Rejection Comments (Project Manager)</Col>
                  <Col span={18} className={styles.detailColumn}>
                    <span>{commentPM}</span>
                  </Col>
                </Row>
              )}
              {status === TIMEOFF_STATUS.rejected && currentStep > 2 && (
                <Row>
                  <Col span={6}>Request Rejection Comments (Region Head)</Col>
                  <Col span={18} className={styles.detailColumn}>
                    <span>{commentCLA}</span>
                  </Col>
                </Row>
              )}
            </div>
            {(status === TIMEOFF_STATUS.drafts || status === TIMEOFF_STATUS.inProgress) && (
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
