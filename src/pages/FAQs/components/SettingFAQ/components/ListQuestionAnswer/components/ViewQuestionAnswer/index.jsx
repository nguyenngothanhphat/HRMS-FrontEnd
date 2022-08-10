import { Button, Image as ImageTag, Modal } from 'antd';
import Parser from 'html-react-parser';
import React, { useState } from 'react';
import { hashtagify, urlify } from '@/utils/homePage';
import styles from './index.less';

const ViewQuestionAnswer = (props) => {
  const {
    onClose = () => {},
    visible,
    item: { attachment = {}, question = '', answer = '' } = {},
  } = props;

  const handleCancel = () => {
    onClose();
  };

  const renderModalHeader = () => {
    return (
      <div className={styles.header}>
        <p className={styles.header__text}>View Question</p>
      </div>
    );
  };
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
  const renderModalContent = () => {
    return (
      <div className={styles.content}>
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

  return (
    <>
      <Modal
        className={`${styles.ViewQuestionAnswer} ${styles.noPadding}`}
        onCancel={handleCancel}
        destroyOnClose
        width={696}
        footer={
          <Button className={styles.btnSubmit} onClick={handleCancel}>
            Close
          </Button>
        }
        title={renderModalHeader()}
        centered
        visible={visible}
      >
        {renderModalContent()}
      </Modal>
    </>
  );
};

export default ViewQuestionAnswer;
