import { Card, Col, Divider, Row } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { connect, history } from 'umi';
import { dateFormat, OFFBOARDING } from '@/utils/offboarding';
import CustomSecondaryButton from '@/components/CustomSecondaryButton';
import CustomPrimaryButton from '@/components/CustomPrimaryButton';
import SetMeetingModal from '../../../SetMeetingModal';

import styles from './index.less';

const { STATUS } = OFFBOARDING;
const RequestDetail = (props) => {
  const {
    loading = false,
    employee = {},
    dispatch,
    data: { ticketId = '', createdAt = '', LWD = '', reason = '', status } = {},
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

  const onFinish = (value) => {};

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
          <CustomSecondaryButton onClick={handleWithdraw}>Withdraw</CustomSecondaryButton>
          <CustomPrimaryButton onClick={() => setVisible(true)}>
            Schedule 1 on 1
          </CustomPrimaryButton>
        </div>
      </Card>
      <SetMeetingModal
        visible={visible}
        title="Set 1-on1 with Manager"
        onClose={() => setVisible(false)}
        partnerRole="Manager"
        employee={employee}
        onFinish={onFinish}
      />
    </div>
  );
};

export default connect()(RequestDetail);
