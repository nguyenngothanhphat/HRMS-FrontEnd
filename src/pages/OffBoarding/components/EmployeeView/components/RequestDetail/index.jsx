import { Avatar, Button, Card, Col, DatePicker, Divider, Row, Select } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';
import CommonModal from '@/components/CommonModal';
import avtDefault from '@/assets/defaultAvatar.png';
import styles from './index.less';

const RequestDetail = (props) => {
  const {
    loading = false,
    employee: {
      managerInfo: {
        generalInfoInfo: { legalName: managerName = '', avatar = '' } = {},
        titleInfo: { name: titleName = '' } = {},
      } = {},
    } = {},
  } = props;
  const { listMeetingTime = [] } = props;
  const [visible, setVisible] = useState(false);
  const status = 'In Progress';

  const renderStatus = (statusPorps) => {
    if (statusPorps === 'DRAFT') {
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

  const set1On1Content = () => {
    return (
      <div className={styles.set1On1Content}>
        <div style={{ fontWeight: 500 }}>Reporting Manager</div>
        <div className={styles.reporting}>
          <Avatar src={avatar || avtDefault} />
          <div>
            <div className={styles.legalName}>{managerName}</div>
            <div className={styles.titleinfo}>{titleName}</div>
          </div>
        </div>
        <div className={styles.flexContent}>
          <div>
            <div className={styles.subText}>Meeting on</div>
            <DatePicker format="YYYY-MM-DD" className={styles.datePicker} />
          </div>
          <div>
            <div className={styles.subText}>Meeting at</div>
            <Select className={styles.datePicker}>
              {listMeetingTime.map((item) => (
                <Select.Option key={item} value={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.RequestDetail}>
      <Card title="Your Request" extra={renderStatus(status)}>
        <div style={{ margin: '24px', fontSize: '13px' }}>
          <Row gutter={[24, 24]}>
            <div className={styles.containerInfo}>
              <div>
                <span className={styles.title}>Ticket ID:</span>
                <span style={{ color: '#2c6df9' }}>16003134</span>
              </div>
              <div>
                <span className={styles.title}>Assigned:</span>
                <span style={{ color: '#464646' }}>15-10-2021</span>
              </div>
              <div>
                <span className={styles.title}>Tentative Last Working Date:</span>
                <span style={{ color: '#464646' }}>15-01-2022</span>
              </div>
            </div>
            <Col span={24} className={styles.title}>
              Reason for leaving us?
            </Col>
            <Col span={24} style={{ color: '#707177' }}>
              The reason I have decided to end my journey with Lollypop here is because…The reason I
              have decided to end my journey with Lollypop here is because…The reason I have decided
              to end my journey with Lollypop here is because…
            </Col>
          </Row>
        </div>
        <Divider />
        <div className={styles.containerBtn}>
          <Button className={styles.btnWithdraw}>Withdraw</Button>
          <Button className={styles.btnJoin} onClick={() => setVisible(true)}>
            Schedule 1 on 1
          </Button>
        </div>
      </Card>
      <CommonModal
        visible={visible}
        title="Set 1-on1 with Manager"
        onClose={() => setVisible(false)}
        content={set1On1Content()}
        width={500}
        loading={loading}
        withPadding
      />
    </div>
  );
};

export default connect()(RequestDetail);
