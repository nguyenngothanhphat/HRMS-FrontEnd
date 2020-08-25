import React, { PureComponent } from 'react';
import { Row, Col, BackTop } from 'antd';
import s from './index.less';
import ZoomImage from '@/components/ZoomImage';

class InstallIOS extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      src: '',
    };
  }

  showModal = src => {
    this.setState({
      visible: true,
      src,
    });
  };

  _handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { visible, src } = this.state;
    return (
      <Row className={s.containerView}>
        <Col span={24} className={s.contentView}>
          <div>
            <BackTop />
          </div>
          <div>
            <p className={s.textContent}>
              For iOS version, the app is submitted privately for Terralogic Enterprise in Business
              manager store; it can’t be accessed publicly via Apple Store. In order to install the
              app, the Terralogic Employee need to send a request to Expenso Admin to receive a
              redemption Link (or Code) along with an instruction on how to install the app on iOS
              device.
            </p>
            <p className={s.textContent}>Instruction to install the iOS app on a device:</p>
            <p className={s.textLv1}>1. Open App Store on the iOS device</p>
            <p className={s.textLv1}>2. Go to Account (tapping on top right corner button)</p>
            <img
              onClick={() => this.showModal('/assets/images/032.png')}
              className={s.img}
              src="/assets/images/032.png"
              alt="profile"
            />
            <p className={s.textLv1}>3. Go to &quot;Redeem Gift Card or Code&quot;</p>
            <img
              onClick={() => this.showModal('/assets/images/033.png')}
              className={s.img}
              src="/assets/images/033.png"
              alt="profile"
            />
            <p className={s.textLv1}>
              4. Enter the redeem code and tap on Redeem button to download the app
            </p>
            <img
              onClick={() => this.showModal('/assets/images/034.png')}
              className={s.img}
              src="/assets/images/034.png"
              alt="profile"
            />
            <p className={s.textContent}>
              Once installing the iOS app on a device via Redemption code, the code will be tied to
              the device and it can’t be reused for any second one.
            </p>
            <ZoomImage
              handleCancel={this._handleCancel}
              visible={visible}
              src={src}
              widthStyle="35%"
            />
          </div>
        </Col>
      </Row>
    );
  }
}

export default InstallIOS;
