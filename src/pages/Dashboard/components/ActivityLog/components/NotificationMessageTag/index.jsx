import { Row, Col } from 'antd';
import moment from 'moment';
import React from 'react';
import { connect, history } from 'umi';
import styles from './index.less';
import openTR from '@/assets/openTR.svg';

const NotificationTag = (props) => {
  const {
    item: { messages = [], newMessages = 0, sendFrom = '', candidateId = '' } = {},
    setModalVisible = () => {},
    employee = {},
    dispatch,
  } = props;
  const { createdAt: date = '' } = messages[0];
  const handleClick = () => {
    const userId = employee ? employee._id : '';
    const conversationId = messages[0] ? messages[0].conversationId : '';
    dispatch({
      type: 'conversation/seenMessageEffect',
      payload: {
        userId,
        conversationId,
      }
    })
    dispatch({
      type: 'conversation/getConversationUnSeenEffect',
      payload: {
        userId,
      },
    });
    history.push(`/onboarding/list/view/${candidateId}`);
    setModalVisible();
  };
  // RENDER UI
  const renderTag = () => {
    const dateTemp = moment(date).date();
    const monthTemp = moment(date).locale('en').format('MMM');
    return (
      <Col span={24}>
        <div className={styles.NotificationTag}>
          <Row align="middle" justify="space-between">
            <Col span={20} className={styles.leftPart}>
              <div className={styles.dateTime}>
                <span>{dateTemp}</span>
                <span>{monthTemp}</span>
              </div>
              <div className={styles.content}>
                Onboarding - You have {newMessages} new message from the Candidate {sendFrom} -
                <span className={styles.userId}>[Candidate ID #{candidateId}]</span>
              </div>
            </Col>
            <Col span={4} className={styles.rightPart}>
              <div className={styles.viewBtn} onClick={() => handleClick()}>
                <img src={openTR} alt="notification-icon" height={32} width={32} />
              </div>
            </Col>
          </Row>
        </div>
      </Col>
    );
  };

  return renderTag();
};

export default connect(({ loading, user: { currentUser: { employee = {} } } = {} }) => ({
  employee,
  loading: loading.effects['conversation/seenMessageEffect'],
}))(NotificationTag);
