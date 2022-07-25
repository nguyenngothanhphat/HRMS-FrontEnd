import { Col, Row, Tooltip } from 'antd';
import React from 'react';
import styles from './index.less';
import WarningIcon from '@/assets/warnIcon.svg';
import ChartIcon from '@/assets/homePage/chart.svg';

const BarGraph = (props) => {
  const {
    options = [],
    showTitle = true,
    activePoll = {},
    votedOption = '',
    countVotes = () => {},
    timeLeft = '',
  } = props;

  const { pollDetail: { question = '' } = {} } = activePoll;

  return (
    <div className={styles.BarGraph}>
      {showTitle && <p className={styles.questionText}>{question}</p>}
      <Row gutter={[0, 10]} className={styles.poll}>
        {options.map((reply) => (
          <Col span={24}>
            <div
              className={`${styles.reply} ${votedOption === reply.id ? styles.votedOption : ''}`}
            >
              <span className={styles.label}>{reply.text}</span>
              <span className={styles.percent}>
                {reply.percent}%{' '}
                <Tooltip title={`${reply.count} of Employees whose votes have been recorded.`}>
                  <img src={WarningIcon} alt="icon" />
                </Tooltip>
              </span>

              <div
                className={styles.percentBackground}
                style={{
                  width: `${reply.percent}%`,
                  backgroundColor: votedOption === reply.id ? '#2c6df9' : '',
                }}
              />
            </div>
          </Col>
        ))}
      </Row>
      <div className={styles.votingInformation}>
        <span className={styles.number}>
          <Tooltip title="Number of Employees whose votes have been recorded.">
            <img src={ChartIcon} alt="icon" />
          </Tooltip>
          {countVotes()} votes
        </span>

        {timeLeft && (
          <span>
            <span className={styles.dueTime}>Poll Ends on</span>
            <span className={styles.number}>{timeLeft}</span>
          </span>
        )}
      </div>
    </div>
  );
};

export default BarGraph;
