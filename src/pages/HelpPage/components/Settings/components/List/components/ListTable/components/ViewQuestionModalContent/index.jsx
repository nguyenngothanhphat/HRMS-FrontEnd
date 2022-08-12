import { Image as ImageTag } from 'antd';
import Parser from 'html-react-parser';
import { connect } from 'umi';
import React from 'react';
import { hashtagify, urlify } from '@/utils/homePage';
import styles from './index.less';
import { HELP_TYPO } from '@/constants/helpPage';

const ViewQuestionModalContent = (props) => {
  const {
    item: { attachment = {}, question = '', answer = '' } = {},
    helpPage: { helpType = '' } = {},
  } = props;

  const renderContent = (text) => {
    const temp = urlify(text);
    return hashtagify(temp);
  };

  const renderMedia = (media) => {
    const src = media[0].url;
    const fileRegex = /image[/]|video[/]/gim;
    const checkType = fileRegex.test(media[0].type);
    return (
      <div className={styles.media}>
        {checkType &&
          (media[0].type.match(/image[/]/gim) ? (
            <ImageTag.PreviewGroup>
              <ImageTag className={styles.media__image} src={src} alt="img" />
            </ImageTag.PreviewGroup>
          ) : (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <video className={styles.media__video} src={src} alt="video" controls autoPlay />
          ))}
      </div>
    );
  };

  const questionName = HELP_TYPO[helpType].SETTINGS.QUESTION_TOPIC.NAME;
  const answerName = HELP_TYPO[helpType].SETTINGS.QUESTION_TOPIC.DESC_LABEL;

  return (
    <div className={styles.ViewQuestionModalContent}>
      <p>
        <b>{questionName}:</b> {question || ''}
      </p>
      <p>
        <b>{answerName}:</b> {answer ? Parser(renderContent(answer)) : ''}
      </p>
      {attachment?.length && renderMedia(attachment)}
    </div>
  );
};

export default connect(({ helpPage }) => ({ helpPage }))(ViewQuestionModalContent);
