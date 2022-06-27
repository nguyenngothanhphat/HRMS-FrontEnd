import { LinkPreview } from '@dhaiwat10/react-link-preview';
import { Col, Image, Row } from 'antd';
import Parser from 'html-react-parser';
import React from 'react';
import { getUrlFromString, hashtagify, urlify } from '@/utils/homePage';
import styles from './index.less';

const PostContent = (props) => {
  const { post: { attachments = [], description = '' } = {} } = props;

  const renderImageLayout = (images) => {
    const number = images.length;
    const restImages = images.slice(1, 4);

    const renderRestImage = () => {
      return restImages.map((x) => {
        return (
          <Col span={24}>
            <Image preview={{ visible: false }} src={x} />
          </Col>
        );
      });
    };
    switch (number) {
      case 0:
        return null;
      case 1:
        return (
          <Row gutter={[4, 4]}>
            <Col span={24}>
              <Image preview={{ visible: false }} src={images[0]} />
            </Col>
          </Row>
        );
      case 2:
        return (
          <Row gutter={[4, 4]}>
            <Col span={12}>
              <Image preview={{ visible: false }} src={images[0]} />
            </Col>
            <Col span={12}>
              <Image preview={{ visible: false }} src={images[1]} />
            </Col>
          </Row>
        );
      default:
        return (
          <Row gutter={[4, 4]}>
            <Col span={14}>
              <Image preview={{ visible: false }} src={images[0]} />
            </Col>
            <Col span={10}>
              <Row gutter={[4, 4]}>{renderRestImage()}</Row>
            </Col>
          </Row>
        );
    }
  };

  const renderPreviewImage = () => {
    return (
      attachments.length > 0 && (
        <div className={styles.previewImage}>
          <Image.PreviewGroup>
            {renderImageLayout(attachments.map((x) => x.url))}
          </Image.PreviewGroup>
        </div>
      )
    );
  };

  const renderImageCountTag = () => {
    const count = attachments.length - 4;
    return (
      attachments.length > 4 && (
        <div className={styles.countTag}>
          <span>
            +{count} {count < 2 ? 'image' : 'images'}
          </span>
        </div>
      )
    );
  };

  const renderPreviewLink = () => {
    if (attachments.length > 0) return null;

    const url = getUrlFromString(description) || [];
    if (url.length === 0) return null;
    return (
      <div className={styles.previewContainer}>
        <LinkPreview
          url={url[0]}
          className={styles.previewLink}
          borderRadius={8}
          height={100}
          imageHeight={100}
          openInNewTab
          descriptionLength={80}
          showLoader={false}
        />
      </div>
    );
  };

  const renderContent = (text) => {
    const temp = urlify(text);
    return hashtagify(temp);
  };

  return (
    <div className={styles.PostContent}>
      <div className={styles.content}>{description ? Parser(renderContent(description)) : ''}</div>
      {renderPreviewImage()}
      {renderImageCountTag()}
      {renderPreviewLink()}
    </div>
  );
};

export default PostContent;
