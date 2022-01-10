import React from 'react';
import { Row, Col } from 'antd';
import styles from './index.less';
import GrayDot from '@/assets/homePage/grayDot.svg';

const mockReplies = [
  {
    id: 1,
    text: 'Wayyy too excited, cannot wait!!',
  },
  {
    id: 2,
    text: 'Ready for the change, I guess!',
  },
  {
    id: 3,
    text: 'Meh, want some more time',
  },
];
const Voting = () => {
  return (
    <div className={styles.Voting}>
      <p className={styles.questionText}>How do you feel about getting back to office?</p>
      <Row gutter={[0, 16]} className={styles.replies}>
        {mockReplies.map((reply) => (
          <Col span={24}>
            <div className={styles.reply}>
              <span>{reply.text}</span>
            </div>
          </Col>
        ))}
      </Row>
      <div className={styles.votingInformation}>
        <span className={styles.number}>0 votes</span>
        <img src={GrayDot} alt="" />
        <span className={styles.dueTime}>2 weeks left</span>
      </div>
    </div>
  );
};

export default Voting;
