import React from 'react';
import { Carousel, Icon, Modal, Tooltip } from 'antd';
import { red } from '@ant-design/colors';
import styles from './index.less';

class Gallery extends React.PureComponent {
  constructor(props) {
    super(props);
    this.carousel = React.createRef();
    this.state = {
      current: 1,
    };
  }

  next = () => {
    this.carousel.next();
  };

  previous = () => {
    this.carousel.prev();
  };

  handleCancel = () => {
    this.setState({ previewVisible: undefined });
  };

  getImageType = link => {
    return link.slice(link.length - 3, link.length);
  };

  openPDF = link => {
    window.open(link, '_blank');
  };

  render() {
    let { images } = this.props;
    const { current, previewVisible } = this.state;
    images =
      typeof images === 'object' && images.length
        ? images.map((image, index) => ({ key: `image-${index}`, link: image }))
        : [];
    if (images.length === 0)
      return (
        <div style={{ textAlign: 'center' }}>
          <img className={styles.imgBox} alt="img" src="/assets/img/NO_IMAGE.jpg" />
        </div>
      );

    return (
      <div>
        <Carousel
          ref={node => {
            this.carousel = node;
          }}
          effect="fade"
          dots={false}
          afterChange={i => {
            this.setState({ current: i + 1 });
          }}
        >
          {images &&
            images.map(image => (
              <div key={image.key}>
                {this.getImageType(image.link) === 'pdf' ? (
                  <Tooltip placement="top" title="Click to open">
                    <Icon
                      onClick={() => this.openPDF(image.link)}
                      type="file-pdf"
                      style={{
                        fontSize: '100px',
                        color: red[5],
                        height: '225px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    />
                  </Tooltip>
                ) : (
                  <img
                    className={styles.imgBox}
                    alt="img"
                    src={image.link}
                    onClick={() => {
                      this.setState({ previewVisible: image.link });
                    }}
                  />
                )}
              </div>
            ))}
        </Carousel>
        <div className={styles.nav}>
          <a onClick={this.previous}>
            <Icon type="left" />
          </a>
          <span className={styles.navInfo}>
            {current}/{images.length}
          </span>
          <a onClick={this.next}>
            <Icon type="right" />
          </a>
        </div>
        <Modal
          visible={!!previewVisible}
          footer={null}
          onCancel={this.handleCancel}
          centered
          width="60%"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
          }}
        >
          <img className={styles.imgView} alt="example" src={previewVisible && previewVisible} />
        </Modal>
      </div>
    );
  }
}

export default Gallery;
