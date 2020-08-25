import React, { PureComponent } from 'react';
import { Row, Col, BackTop } from 'antd';
import s from './index.less';
import ZoomImage from '@/components/ZoomImage';

class UserProfile extends PureComponent {
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
              A user can access user profile to view his employee information that was set on
              Terralogic Intranet, such as:
            </p>
            <p className={s.textLv1}>
              <span className={s.strong}>&bull; User name</span> and
              <span className={s.strong}> Email</span> (terralogic working email)
            </p>
            <p className={s.textLv1}>
              <span className={s.strong}>&bull; User Code</span>: Intranet Employee code
            </p>
            <p className={s.textLv1}>
              <span className={s.strong}>&bull; Title</span>: it is company title &amp; level, such
              as: Engineer, Project Manager, CEO, etc
            </p>
            <p className={s.textLv1}>
              <span className={s.strong}>&bull; Supervisor</span>: aka Direct Manager, who is in the
              first stage of user’s report approval flow.
            </p>
            <p className={s.textLv1}>
              <span className={s.strong}>&bull; Location</span>: aka one of Terralogic offices, the
              location is configured in Intranet and the location ID will be synced to Expenso DB.
            </p>
            <p className={s.textLv1}>
              <span className={s.strong}>&bull; Currency</span>: the default currency of a location
              that is configured in Expenso Admin Configuration; when the user creates a new
              expense, the currency will be picked by default and the user is able to switch to
              another one with exchange rate.
            </p>
            <img
              onClick={() => this.showModal('/assets/images/030.png')}
              className={s.img}
              src="/assets/images/030.png"
              alt="profile"
            />
            <p className={s.textContent}>
              Beside “About You” section, the user is able to configure default Mileage Rate that
              would be used to calculate total cost of traveling path when he wants to add a new
              Mileage expense.
            </p>
            <img
              onClick={() => this.showModal('/assets/images/031.png')}
              className={s.img}
              src="/assets/images/031.png"
              alt="profile"
            />
            <ZoomImage handleCancel={this._handleCancel} visible={visible} src={src} />
          </div>
        </Col>
      </Row>
    );
  }
}

export default UserProfile;
