import { Col, Row } from 'antd';
import React from 'react';
import styles from './index.less';
import GrayDot from '@/assets/homePage/grayDot.svg';

const Options = (props) => {
  const { options = [], setIsVoted = () => {} } = props;

  // FOR PREVIEWING IN SETTINGS PAGE
  const {
    previewing = false,
    contentPreview: {
      previewQuestion = '',
      previewOptions = [],
      // previewStartDate = '',
      // previewEndDate = '',
    } = {},
  } = props;

  if (previewing) {
    return (
      <div className={styles.Options}>
        <p className={styles.questionText}>{previewQuestion}</p>
        <Row gutter={[0, 10]} className={styles.poll}>
          {previewOptions.length > 0
            ? previewOptions.map((reply, index) => {
                return (
                  <Col span={24}>
                    <div className={styles.reply}>
                      <span>{reply.response || `Response ${index + 1}`}</span>
                    </div>
                  </Col>
                );
              })
            : [1, 2, 3].map((reply, index) => {
                return (
                  <Col span={24}>
                    <div className={styles.reply}>
                      <span>Response {index + 1}</span>
                    </div>
                  </Col>
                );
              })}
        </Row>
        <div className={styles.votingInformation}>
          <span className={styles.number}>0 votes</span>
          <img src={GrayDot} alt="" />
          <span className={styles.dueTime}>2d left</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.Options}>
      <p className={styles.questionText}>How do you feel about getting back to office?</p>
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
