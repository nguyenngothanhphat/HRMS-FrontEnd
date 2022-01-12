import { Col, Row } from 'antd';
import React from 'react';
import styles from './index.less';
import GrayDot from '@/assets/homePage/grayDot.svg';

const Options = (props) => {
  const { options = [], setIsVoted = () => {} } = props;

  return (
    <div className={styles.Options}>
      <Row gutter={[0, 10]} className={styles.poll}>
        {options.map((reply) => (
          <Col span={24}>
            <div className={styles.reply} onClick={() => setIsVoted(true)}>
              <span>{reply.text}</span>
            </div>
          </Col>
        ))}
      </Row>
      <div className={styles.votingInformation}>
        <span className={styles.number}>250 votes</span>
        <img src={GrayDot} alt="" />
        <span className={styles.dueTime}>2d left</span>
      </div>
    </div>
  );
};

export default Options;
