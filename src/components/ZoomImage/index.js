import React, { PureComponent } from 'react';
import { Modal, Button, Icon } from 'antd';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import s from './index.less';

class ZoomImage extends PureComponent {
  cancelModal = () => {
    const { handleCancel } = this.props;
    handleCancel();
  };

  render() {
    const { visible, src, widthStyle = '100%' } = this.props;
    return (
      <Modal
        className={s.modalContainer}
        width="90%"
        visible={visible}
        footer={null}
        onCancel={this.cancelModal}
      >
        <TransformWrapper>
          {({ zoomIn, zoomOut, resetTransform }) => (
            <React.Fragment>
              <div style={{ paddingBottom: '20px' }}>
                <Button type="primary" onClick={zoomIn} style={{ marginRight: '10px' }}>
                  <Icon type="zoom-in" style={{ color: '#ffffff', fontSize: '18px' }} />
                </Button>
                <Button type="primary" onClick={zoomOut} style={{ marginRight: '10px' }}>
                  <Icon type="zoom-out" style={{ color: '#ffffff', fontSize: '18px' }} />
                </Button>
                <Button type="primary" onClick={resetTransform}>
                  <Icon type="fullscreen" style={{ color: '#ffffff', fontSize: '18px' }} />
                </Button>
              </div>
              <div className={s.viewImage}>
                <TransformComponent>
                  <div className={s.viewImage}>
                    <img alt="example" style={{ width: widthStyle, height: 'auto' }} src={src} />
                  </div>
                </TransformComponent>
              </div>
            </React.Fragment>
          )}
        </TransformWrapper>
      </Modal>
    );
  }
}

export default ZoomImage;
