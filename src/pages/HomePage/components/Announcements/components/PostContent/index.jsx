import { Col, Image, Row } from 'antd';
import Parser from 'html-react-parser';
import React, { useState } from 'react';
import styles from './index.less';

const PostContent = (props) => {
  const { post: { attachments = [], description = '' } = {} } = props;
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(0);

  const onPreviewImage = (index) => {
    setCurrent(index);
    setVisible(!visible);
  };

  const renderImageLayout = (images) => {
    const number = images.length;
    const restImages = images.slice(1, 4);

    const renderRestImage = () => {
      return restImages.map((x, i) => {
        return (
          <Col span={24}>
            <Image preview={{ visible: false }} onClick={() => onPreviewImage(i + 1)} src={x} />
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
              <Image
                preview={{ visible: false }}
                onClick={() => onPreviewImage(0)}
                src={images[0]}
              />
            </Col>
          </Row>
        );
      case 2:
        return (
          <Row gutter={[4, 4]}>
            <Col span={12}>
              <Image
                preview={{ visible: false }}
                onClick={() => onPreviewImage(0)}
                src={images[0]}
              />
            </Col>
            <Col span={12}>
              <Image
                preview={{ visible: false }}
                onClick={() => onPreviewImage(1)}
                src={images[1]}
              />
            </Col>
          </Row>
        );
      default:
        return (
          <Row gutter={[4, 4]}>
            <Col span={14}>
              <Image
                preview={{ visible: false }}
                onClick={() => onPreviewImage(0)}
                src={images[0]}
              />
            </Col>
            <Col span={10}>
              <Row gutter={[4, 4]}>{renderRestImage()}</Row>
            </Col>
          </Row>
        );
    }
  };

  const renderImagePreview = () => {
    return (
      <div style={{ display: 'none' }}>
        <Image.PreviewGroup
          preview={{
            visible,
            onVisibleChange: (vis) => {
              setVisible(vis);
            },
            current,
          }}
        >
          {attachments.map((x) => (
            <Image src={x.url} />
          ))}
        </Image.PreviewGroup>
      </div>
    );
  };
  const renderPreviewImage = () => {
    return (
      attachments.length > 0 && (
        <div className={styles.previewImage}>
          {renderImageLayout(attachments.map((x) => x.url))}
          {renderImagePreview()}
        </div>
      )
    );
  };

  const renderImageCountTag = () => {
    return (
      attachments.length > 4 && (
        <div className={styles.countTag}>
          <span>+{attachments.length - 4} images</span>
        </div>
      )
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
      {renderImageCountTag()}
      {/* {type === 1 && renderPreviewLink()} */}
    </div>
  );
};

export default PostContent;
