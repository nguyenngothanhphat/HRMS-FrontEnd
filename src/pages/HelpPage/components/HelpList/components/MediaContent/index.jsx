import { Image as ImageTag } from 'antd';
import React from 'react';
import { connect } from 'umi';
import styles from './index.less';

const MediaContent = (props) => {
  const { attachment = {} } = props;
  const src = attachment?.url;
  const fileRegex = /image[/]|video[/]/gim;
  const checkType = fileRegex.test(attachment?.type);

  return (
    <div className={styles.MediaContent}>
      {checkType &&
        (attachment?.type.match(/image[/]/gim) ? (
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

export default connect(({ helpPage: { helpData = [] } = {} }) => ({
  helpData,
}))(MediaContent);
