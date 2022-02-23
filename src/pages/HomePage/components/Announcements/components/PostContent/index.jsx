import React from 'react';
// import { Button } from 'antd';
import Parser from 'html-react-parser';
import styles from './index.less';
// import Lollypop from '@/assets/homePage/lollypop.svg';

const PostContent = (props) => {
  const { post: { attachments = [], description = '' } = {} } = props;

  const renderPreviewImage = () => {
    const [firstImage] = attachments;
    return (
      <div className={styles.previewImage}>
        <img src={firstImage?.url} alt="" />
      </div>
    );
  };

  // const renderPreviewLink = () => {
  //   return (
  //     <div className={styles.previewLink}>
  //       <div className={styles.left}>
  //         <div className={styles.image}>
  //           <img src={Lollypop} alt="" />
  //         </div>
  //         <div className={styles.information}>
  //           <span className={styles.name}>Associate Lead User Experience Designer</span>
  //           <span className={styles.title}>Mumbai, Maharashtra, India</span>
  //         </div>
  //       </div>

  //       <div className={styles.right}>
  //         <Button className={styles.viewJobBtn}>view job</Button>
  //       </div>
  //     </div>
  //   );
  // };

  return (
    <div className={styles.PostContent}>
      <div className={styles.content}>{description ? Parser(description) : ''}</div>
      {renderPreviewImage()}
      {/* {type === 1 && renderPreviewLink()} */}
    </div>
  );
};

export default PostContent;
