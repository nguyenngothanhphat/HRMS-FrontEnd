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
              <span className={s.strong}>&bull; Title</span>: it is company title &amp; level, such
              as: Engineer, Project Manager, CEO, etc
            </p>
            <p className={s.textLv1}>
              <span className={s.strong}>&bull; Supervisor</span>: aka Direct Manager, who is in the
              first stage of user’s report approval flow.
            </p>
            <img
              onClick={() => this.showModal('/assets/images/060.png')}
              className={s.img}
              src="/assets/images/060.png"
              alt="report"
            />
            <p className={s.textContent}>
              Beside “About You” section, the user is able to configure default Mileage Rate that
              would be used to calculate total cost of traveling path when he wants to add a new
              Mileage expense.
            </p>
            <img
              onClick={() => this.showModal('/assets/images/061.png')}
              className={s.img}
              src="/assets/images/061.png"
              alt="report"
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

export default UserProfile;
