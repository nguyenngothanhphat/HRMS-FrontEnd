import React, { useEffect, useState } from 'react';
import { Image as ImageTag } from 'antd';
import { connect } from 'umi';
import styles from './index.less';

const MediaContent = (props) => {
  const { attachment: fileId, listFAQ = [] } = props;
  const tempData = listFAQ.find((x) => x?.attachment?._id === fileId);
  const src = tempData?.attachment?.url;
  const fileRegex = /image[/]|video[/]/gim;
  const checkType = fileRegex.test(tempData?.attachment?.type);

  return (
    <div className={styles.MediaContent}>
      {checkType &&
        (tempData?.attachment?.type.match(/image[/]/gim) ? (
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

export default connect(({ faqs: { listFAQ = [] } = {} }) => ({
  listFAQ,
}))(MediaContent);
