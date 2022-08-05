import { Button, Image as ImageTag, Modal } from 'antd';
import Parser from 'html-react-parser';
import React, { useState } from 'react';
import { hashtagify, urlify } from '@/utils/homePage';
import styles from './index.less';

const ViewQuestionAnswer = (props) => {
  const {
    onClose = () => {},
    visible,
    item: { attachment = {}, url = '', question = '', answer = '' } = {},
  } = props;

  const [isImg, setIsImg] = useState(false);
  const handleCancel = () => {
    onClose();
  };

  const isImageLink = (link) => {
    const img = new Image();
    img.src = link;
    img.onload = () => setIsImg(true);
    img.onerror = () => setIsImg(false);
  };
  // new Promise((resolve) => {
  //   const img = new Image();
  //   img.src = url;
  //   img.onload = () => resolve(true);
  //   img.onerror = () => resolve(false);
  // }).then((x) => this.setState({ isImg: x }));

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
    const { attachment: file, url: link } = media;
    const src = link || (attachment.length > 0 && file[0].url);
    isImageLink(src);
    return (
      <div className={styles.media}>
        {isImg ? (
          <ImageTag.PreviewGroup>
            <ImageTag className={styles.media__image} src={src} alt="img" />
          </ImageTag.PreviewGroup>
        ) : (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video className={styles.media__video} src={src} alt="video" controls autoPlay />
        )}
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
        {(attachment?.length > 0 || url) && renderMedia({ attachment, url })}
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
          <>
            <Button className={styles.btnCancel} onClick={handleCancel}>
              Cancel
            </Button>
            <Button className={styles.btnSubmit} onClick={handleCancel}>
              Close
            </Button>
          </>
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
