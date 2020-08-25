import React, { PureComponent } from 'react';
import { Row, Col, BackTop } from 'antd';
import s from './index.less';
import ZoomImage from '@/components/ZoomImage';

class ReinstallIOS extends PureComponent {
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
              There are some reason that the user needs to remove and reinstall the app; in that
              case, the user just need following these steps (no need to reinput redemption code):
            </p>
            <p className={s.textLv1}>
              1. Open App Store and go to Account (tapping on top right corner button)
            </p>
            <img
              onClick={() => this.showModal('/assets/images/032.png')}
              className={s.img}
              src="/assets/images/032.png"
              alt="reinstall IOS"
            />
            <p className={s.textLv1}>
              2. Go to Purchased to have list of purchased items in the user’s account; in fact,
              when the user installed the app once, it would be available in Purchase list and be
              ready to reinstall.
            </p>
            <img
              onClick={() => this.showModal('/assets/images/035.png')}
              className={s.img}
              src="/assets/images/035.png"
              alt="reinstall IOS"
            />
            <p className={s.textLv1}>3. Search the Expenso app and tap to install it</p>
            <img
              onClick={() => this.showModal('/assets/images/036.png')}
              className={s.img}
              src="/assets/images/036.png"
              alt="reinstall IOS"
            />
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

export default ReinstallIOS;
