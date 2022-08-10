import React, { useEffect, useState } from 'react';
import { Image as ImageTag } from 'antd';
import { connect } from 'umi';
import styles from './index.less';

const MediaContent = (props) => {
  const { attachment: fileId, listFAQ = [] } = props;
  const [isImg, setIsImg] = useState(false);
  const tempData = listFAQ.find((x) => x?.attachment?._id === fileId);
  const src = tempData?.attachment?.url;

  const isImageLink = (imgLink) => {
    const img = new Image();
    img.src = imgLink;
    img.onload = () => setIsImg(true);
    img.onerror = () => setIsImg(false);
  };
  useEffect(() => {
    isImageLink(src);
  }, []);

  return (
    <div className={styles.MediaContent}>
      {isImg ? (
        <ImageTag.PreviewGroup>
          <ImageTag className={styles.MediaContent__image} src={src} alt="img" />
        </ImageTag.PreviewGroup>
      ) : (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video className={styles.MediaContent__video} src={src} alt="video" controls />
      )}
    </div>
  );
};

export default connect(({ faqs: { listFAQ = [] } = {} }) => ({
  listFAQ,
}))(MediaContent);
