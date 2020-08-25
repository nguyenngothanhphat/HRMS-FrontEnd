import React, { PureComponent } from 'react';
import Link from 'umi/link';
import { Row, Col } from 'antd';
import s from './index.less';
import ZoomImage from '@/components/ZoomImage';

class howToLogin extends PureComponent {
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
            <p className={s.textContent}>
              URL:&nbsp;
              <Link to="/login">https://expenso.paxanimi.ai/login</Link>
            </p>
            <p className={s.textContent}>
              Email and Password should be provided by Terralogic Intranet (
              <a href="https://intranet.terralogic.com/">https://intranet.terralogic.com/</a>
              ). If any issue happens with your login credentials, please contact expenso admin via
              expenso@paxanimi.ai
            </p>
            <img
              onClick={() => this.showModal('/assets/images/002.png')}
              className={s.img}
              src="/assets/images/002.png"
              alt="login"
            />
            <ZoomImage handleCancel={this._handleCancel} visible={visible} src={src} />
          </div>
        </Col>
      </Row>
    );
  }
}

export default howToLogin;
