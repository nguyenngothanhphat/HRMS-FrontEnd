import { Image as ImageTag } from 'antd';
import Parser from 'html-react-parser';
import React from 'react';
import { hashtagify, urlify } from '@/utils/homePage';
import styles from './index.less';

const ViewQuestionModalContent = (props) => {
  const { item: { attachment = {}, question = '', answer = '' } = {} } = props;

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
  return (
    <div className={styles.ViewQuestionModalContent}>
      <p>
        <b>Question:</b> {question || ''}
      </p>
      <p>
        <b>Answer:</b> {answer ? Parser(renderContent(answer)) : ''}
      </p>
      {attachment?.length && renderMedia(attachment)}
    </div>
  );
};

export default ViewQuestionModalContent;
