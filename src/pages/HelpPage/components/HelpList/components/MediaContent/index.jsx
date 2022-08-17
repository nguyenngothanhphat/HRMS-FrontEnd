import { Image as ImageTag } from 'antd';
import React from 'react';
import { connect } from 'umi';
import YoutubeEmbed from '@/components/YoutubeEmbed';
import { ATTACHMENT_TYPES } from '@/constants/upload';
import { getAttachmentType } from '@/utils/upload';
import { getYoutubeIdFromUrl } from '@/utils/utils';
import styles from './index.less';

const MediaContent = (props) => {
  const { attachment = {} } = props;
  const src = attachment?.url;

  const renderMedia = () => {
    const attachmentType = getAttachmentType(attachment);
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

  return <div className={styles.MediaContent}>{renderMedia()}</div>;
};

export default connect(({ helpPage: { helpData = [] } = {} }) => ({
  helpData,
}))(MediaContent);
