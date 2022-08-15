import { Image as ImageTag } from 'antd';
import Parser from 'html-react-parser';
import React from 'react';
import { connect } from 'umi';
import YoutubeEmbed from '@/components/YoutubeEmbed';
import { HELP_TYPO } from '@/constants/helpPage';
import { ATTACHMENT_TYPES } from '@/constants/upload';
import { hashtagify, urlify } from '@/utils/homePage';
import { getAttachmentType } from '@/utils/upload';
import { getYoutubeIdFromUrl } from '@/utils/utils';
import styles from './index.less';

const ViewQuestionModalContent = (props) => {
  const {
    item: { attachment = [], question = '', answer = '' } = {},
    helpPage: { helpType = '' } = {},
  } = props;

  const renderContent = (text) => {
    const temp = urlify(text);
    return hashtagify(temp);
  };

  const renderMedia = () => {
    if (attachment.length === 0) return null;

    const src = attachment[0].url;
    const attachmentType = getAttachmentType(attachment[0]);

    switch (attachmentType) {
      case ATTACHMENT_TYPES.IMAGE:
        return (
          <ImageTag.PreviewGroup>
            <ImageTag className={styles.media__image} src={src} alt="img" />
          </ImageTag.PreviewGroup>
        );

      case ATTACHMENT_TYPES.VIDEO:
        return (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video className={styles.media__video} src={src} alt="video" controls autoPlay />
        );

      case ATTACHMENT_TYPES.YOUTUBE:
        return <YoutubeEmbed embedId={getYoutubeIdFromUrl(src)} />;

      default:
        return null;
    }
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
      {attachment && <div className={styles.media}>{renderMedia()} </div>}
    </div>
  );
};

export default connect(({ helpPage }) => ({ helpPage }))(ViewQuestionModalContent);
