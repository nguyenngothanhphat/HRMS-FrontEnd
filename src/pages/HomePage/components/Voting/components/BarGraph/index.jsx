import { Col, Row } from 'antd';
import React from 'react';
import styles from './index.less';
import GrayDot from '@/assets/homePage/grayDot.svg';

const BarGraph = (props) => {
  const { options = [], showTitle = true } = props;

  return (
    <div className={styles.BarGraph}>
      {showTitle && (
        <p className={styles.questionText}>How do you feel about getting back to office?</p>
      )}
      <Row gutter={[0, 10]} className={styles.poll}>
        {options.map((reply) => (
          <Col span={24}>
            <div className={styles.reply}>
              <span className={styles.label}>{reply.text}</span>
              <span className={styles.percent}>{reply.percent}%</span>
              <div className={styles.percentBackground} style={{ width: `${reply.percent}%` }} />
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

export default BarGraph;
