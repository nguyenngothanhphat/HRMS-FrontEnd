import React, { useState } from 'react';
import { Row, Col } from 'antd';
import styles from './index.less';
import GrayDot from '@/assets/homePage/grayDot.svg';

const mockOptions = [
  {
    id: 1,
    text: '🤩 Wayyy too excited, cannot wait!!',
    percent: 54,
  },
  {
    id: 2,
    text: '😇 Ready for the change, I guess!',
    percent: 42,
  },
  {
    id: 3,
    text: '🥱 Meh, want some more time',
    percent: 4,
  },
];

const Voting = () => {
  const [isVoted, setIsVoted] = useState(false);

  const renderOptions = () => {
    return (
      <Row gutter={[0, 10]} className={styles.options}>
        {mockOptions.map((reply) => (
          <Col span={24}>
            <div className={styles.reply} onClick={() => setIsVoted(true)}>
              <span>{reply.text}</span>
            </div>
          </Col>
        ))}
      </Row>
    );
  };

  const renderResult = () => {
    return (
      <Row gutter={[0, 10]} className={styles.result}>
        {mockOptions.map((reply) => (
          <Col span={24}>
            <div className={styles.reply}>
              <span className={styles.label}>{reply.text}</span>
              <span className={styles.percent}>{reply.percent}%</span>
              <div className={styles.percentBackground} style={{ width: `${reply.percent}%` }} />
            </div>
          </Col>
        ))}
      </Row>
    );
  };

  return (
    <div className={styles.Voting}>
      <p className={styles.questionText}>How do you feel about getting back to office?</p>
      {/* {renderOptions()} */}
      {isVoted ? renderResult() : renderOptions()}
      <div className={styles.votingInformation}>
        <span className={styles.number}>250 votes</span>
        <img src={GrayDot} alt="" />
        <span className={styles.dueTime}>2d left</span>
      </div>
    </div>
  );
};

export default Voting;
