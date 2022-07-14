import { Col, Row } from 'antd';
import React from 'react';
import { connect } from 'umi';
import styles from './index.less';
import GrayDot from '@/assets/homePage/grayDot.svg';

const Options = (props) => {
  const {
    options = [],
    setIsVoted = () => {},
    activePoll = {},
    refreshPoll = () => {},
    countVotes = () => {},
    setVotedOption = () => {},
    timeLeft = '',
  } = props;
  const { dispatch, user: { currentUser: { employee = {} } = {} } = {} } = props;

  const { _id: pollId = '', pollDetail: { question = '' } = {} } = activePoll;

  // FOR PREVIEWING IN SETTINGS PAGE
  const {
    previewing = false,
    contentPreview: {
      previewQuestion = 'Question',
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

  const onVote = async (choice) => {
    if (employee?._id) {
      const res = await dispatch({
        type: 'homePage/votePollEffect',
        payload: {
          pollId,
          choice,
          employee: employee._id,
        },
      });
      if (res.statusCode === 200) {
        refreshPoll(pollId);
        setVotedOption(choice);
        setIsVoted(true);
      }
    }
  };

  return (
    <div className={styles.Options}>
      <p className={styles.questionText}>{question}</p>
      <Row gutter={[0, 10]} className={styles.poll}>
        {options.map((reply) => (
          <Col span={24}>
            <div className={styles.reply} onClick={() => onVote(reply.id)}>
              <span>{reply.text}</span>
            </div>
          </Col>
        ))}
      </Row>
      <div className={styles.votingInformation}>
        <span className={styles.number}>{countVotes()} votes</span>
        {timeLeft && (
          <>
            <img src={GrayDot} alt="" />
            <span className={styles.dueTime}>{timeLeft}</span>
          </>
        )}
      </div>
    </div>
  );
};

export default connect(({ homePage, user }) => ({
  homePage,
  user,
}))(Options);
