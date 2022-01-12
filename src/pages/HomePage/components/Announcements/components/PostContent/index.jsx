import React from 'react';
import { Button } from 'antd';
import styles from './index.less';
import Lollypop from '@/assets/homePage/lollypop.svg';

const PostContent = (props) => {
  const { post: { content = '', type = 3, image = '', link = 1 } = {} } = props;

  const renderPreviewImage = () => {
    return (
      <div className={styles.previewImage}>
        <img src={image} alt="" />
      </div>
    );
  };

  const renderPreviewLink = () => {
    return (
      <div className={styles.previewLink}>
        <div className={styles.left}>
          <div className={styles.image}>
            <img src={Lollypop} alt="" />
          </div>
          <div className={styles.information}>
            <span className={styles.name}>Associate Lead User Experience Designer</span>
            <span className={styles.title}>Mumbai, Maharashtra, India</span>
          </div>
        </div>

        <div className={styles.right}>
          <Button className={styles.viewJobBtn}>view job</Button>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.PostContent}>
      <div className={styles.content}>{content}</div>
      {type === 2 && renderPreviewImage()}
      {type === 1 && renderPreviewLink()}
    </div>
  );
};

export default PostContent;
