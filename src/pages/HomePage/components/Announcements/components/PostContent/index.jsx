/* eslint-disable jsx-a11y/media-has-caption */
import { LinkPreview } from '@dhaiwat10/react-link-preview';
import { Col, Image, Row } from 'antd';
import Parser from 'html-react-parser';
import React, { useState } from 'react';
import PreviewImage from '@/assets/homePage/previewImage.png';
import YoutubeEmbed from '@/components/YoutubeEmbed';
import { ATTACHMENT_TYPES } from '@/constants/upload';
import { getUrlFromString, hashtagify, urlify } from '@/utils/homePage';
import { getAttachmentType } from '@/utils/upload';
import { getYoutubeIdFromUrl } from '@/utils/utils';
import styles from './index.less';

const PostContent = (props) => {
  const { post: { attachments = [], description = '' } = {} } = props;

  const [mode, setMode] = useState(false);
  // const [isImg, setIsImg] = useState(false);

  const getMode = ({ target: img }) => {
    setMode(img?.offsetHeight > img?.offsetWidth);
    // eslint-disable-next-line no-param-reassign
    img.src = null;
  };

  const renderMoreThan3 = (arr = []) => {
    // horizontal
    if (mode) {
      return (
        <Row gutter={[8, 8]}>
          <Col span={14}>
            <Image
              src={arr[0]}
              onError={(e) => {
                e.target.src = PreviewImage;
              }}
            />
          </Col>
          <Col span={10}>
            <Row gutter={[8, 8]}>
              {arr.slice(1, arr.length).map((x, i) => {
                return (
                  <Col span={i < 3 ? 24 : 0} key={`${i + 1}`}>
                    <Image
                      src={x}
                      onError={(e) => {
                        e.target.src = PreviewImage;
                      }}
                    />
                  </Col>
                );
              })}
            </Row>
          </Col>
        </Row>
      );
    }

    const secondRowSpan = arr.length < 4 ? 24 / (arr.length - 1) : 8;
    return (
      <Row gutter={[8, 0]}>
        <Col span={24}>
          <Image
            src={arr[0]}
            onError={(e) => {
              e.target.src = PreviewImage;
            }}
            height={380}
          />
        </Col>

        {arr.slice(1, arr.length).map((x, i) => {
          return (
            <Col span={i < 3 ? secondRowSpan : 0} key={`${i + 1}`}>
              <Image
                src={x}
                onError={(e) => {
                  e.target.src = PreviewImage;
                }}
                height={200}
              />
            </Col>
          );
        })}
      </Row>
    );
  };

  const renderImageLayout = (images) => {
    const number = images.length;

    switch (number) {
      case 0:
        return null;
      case 1:
        return (
          <Row gutter={0}>
            <Col span={24}>
              <Image
                src={images[0]}
                onError={(e) => {
                  e.target.src = PreviewImage;
                }}
                height={500}
              />
            </Col>
          </Row>
        );
      case 2:
        if (mode) {
          return (
            <Row gutter={[4, 0]}>
              <Col span={24}>
                <Image
                  src={images[0]}
                  onError={(e) => {
                    e.target.src = PreviewImage;
                  }}
                  height={250}
                />
              </Col>
              <Col span={24}>
                <Image
                  src={images[1]}
                  onError={(e) => {
                    e.target.src = PreviewImage;
                  }}
                  height={250}
                />
              </Col>
            </Row>
          );
        }
        return (
          <Row gutter={[4, 4]}>
            <Col span={12}>
              <Image
                src={images[0]}
                onError={(e) => {
                  e.target.src = PreviewImage;
                }}
                height={500}
              />
            </Col>
            <Col span={12}>
              <Image
                src={images[1]}
                onError={(e) => {
                  e.target.src = PreviewImage;
                }}
                height={500}
              />
            </Col>
          </Row>
        );
      default:
        return renderMoreThan3(images);
    }
  };

  const renderPreviewImage = () => {
    const [first] = attachments || [];
    const attachmentType = getAttachmentType(first);

    switch (attachmentType) {
      case ATTACHMENT_TYPES.IMAGE:
        return (
          <div className={styles.previewImage}>
            <Image.PreviewGroup>
              {renderImageLayout(attachments.map((x) => x.url))}
            </Image.PreviewGroup>
          </div>
        );

      case ATTACHMENT_TYPES.VIDEO:
        return (
          <div className={styles.previewImage}>
            <video src={first?.url} alt="video" width="100%" controls />
          </div>
        );

      case ATTACHMENT_TYPES.YOUTUBE:
        return (
          <div className={styles.previewImage}>
            <YoutubeEmbed embedId={getYoutubeIdFromUrl(first?.url)} />
          </div>
        );

      default:
        return null;
    }
  };

  const renderImageCountTag = () => {
    const count = attachments.length - 4;
    return (
      attachments.length > 4 && (
        <div
          className={styles.countTag}
          style={{
            bottom: mode ? 0 : 8,
          }}
        >
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
      {attachments && attachments?.length > 0 && (
        <img
          src={attachments[0].url}
          onLoad={getMode}
          alt=""
          style={{
            visibility: 'hidden',
            position: 'absolute',
          }}
        />
      )}

      {renderPreviewImage()}
      {renderImageCountTag()}
      {renderPreviewLink()}
    </div>
  );
};

export default PostContent;
