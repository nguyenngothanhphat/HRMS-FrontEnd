import { Card, Col, Divider, Row } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { connect } from 'umi';
import { dateFormat, OFFBOARDING } from '@/utils/offboarding';
import CustomSecondaryButton from '@/components/CustomSecondaryButton';
import CustomPrimaryButton from '@/components/CustomPrimaryButton';
import SetMeetingModal from '../../../SetMeetingModal';

import styles from './index.less';

const { STATUS, UPDATE_ACTION } = OFFBOARDING;
const RequestDetail = (props) => {
  const {
    loadingSchedule = false,
    loadingWithdraw = false,
    employee: { managerInfo = {} } = {},
    dispatch,
    data: { ticketId = '', createdAt = '', LWD = '', reason = '', status = '', _id = '' } = {},
    getMyRequest = () => {},
  } = props;

  const [visible, setVisible] = useState(false);

  const renderStatus = (statusPorps) => {
    if (statusPorps === STATUS.DRAFT) {
      return (
        <div className={styles.containerStatus}>
          <div>Status: </div>
          <div className={styles.statusDraft} />
          <div style={{ color: '#fd4546' }}>Draft</div>
        </div>
      );
    }
    return (
      <div className={styles.containerStatus}>
        <div>Status: </div>
        <div className={styles.statusInProgress} />
        <div style={{ color: '#ffa100' }}>In Progress</div>
      </div>
    );
  };

  const onFinish = (values) => {
    dispatch({
      type: 'offboarding/updateRequestEffect',
      payload: {
        action: UPDATE_ACTION.EMPLOYEE_RESCHEDULE,
        meeting: {
          emplyeetDate: moment.utc(values?.date).format('YYYY-MM-DD'),
        },
        id: _id,
      },
    });
  };

  const handleWithdraw = () => {
    dispatch({
      type: 'offboarding/withdrawRequestEffect',
      payload: {},
    }).then((res) => {
      const { statusCode = '' } = res;
      if (statusCode === 200) {
        getMyRequest();
      }
    });
  };

  return (
    <div className={styles.RequestDetail}>
      <Card title="Your Request" extra={renderStatus(status)}>
        <div style={{ margin: '24px', fontSize: '13px' }}>
          <Row gutter={[24, 24]}>
            <div className={styles.containerInfo}>
              <div>
                <span className={styles.title}>Ticket ID:</span>
                <span style={{ color: '#2c6df9' }}>{ticketId}</span>
              </div>
              <div>
                <span className={styles.title}>Assigned:</span>
                <span style={{ color: '#464646' }}>{moment(createdAt).format(dateFormat)}</span>
              </div>
              <div>
                <span className={styles.title}>Tentative Last Working Date:</span>
                <span style={{ color: '#464646' }}>{moment(LWD).format(dateFormat)}</span>
              </div>
            </div>
            <Col span={24} className={styles.title}>
              Reason for leaving us?
            </Col>
            <Col span={24} style={{ color: '#707177' }}>
              {reason}
            </Col>
          </Row>
        </div>
        <Divider />
        <div className={styles.containerBtn}>
          <CustomSecondaryButton onClick={handleWithdraw} loading={loadingWithdraw}>
            Withdraw
          </CustomSecondaryButton>
          <CustomPrimaryButton onClick={() => setVisible(true)} loading={loadingSchedule}>
            Schedule 1 on 1
          </CustomPrimaryButton>
        </div>
      </Card>
      <SetMeetingModal
        visible={visible}
        title="Set 1-on1 with Manager"
        onClose={() => setVisible(false)}
        partnerRole="Manager"
        employee={managerInfo}
        onFinish={onFinish}
      />
    </div>
  );
};

export default connect(({ loading }) => ({
  loadingSchedule: loading.effects['offboarding/createMeeting'],
  loadingWithdraw: loading.effects['offboarding/createRequestEffect'],
}))(RequestDetail);
