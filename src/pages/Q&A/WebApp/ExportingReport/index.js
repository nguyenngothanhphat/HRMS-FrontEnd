import React, { PureComponent } from 'react';
import { Row, Col, BackTop } from 'antd';
import ZoomImage from '@/components/ZoomImage';
import s from './index.less';

class Exporting extends PureComponent {
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
            <div>
              <BackTop />
            </div>
            <p className={s.textContent}>
              As a part of report management features, the system supports user to export reports to
              PDF and Excel files that are needed for finacial paper works.
            </p>
            <p className={s.textContent}>There are multiple ways to export a report:</p>
            <p className={s.textLv1}>
              1. From an employee’s persective (creator of a report), when he wants to export his
              reports by himselft, he could just access Report, choose tab Request and select
              reports to export to PDF or excel fiels
            </p>
            <img
              onClick={() => this.showModal('/assets/images/027.png')}
              className={s.img}
              src="/assets/images/027.png"
              alt="login"
            />
            <p className={s.textLv1}>
              2. By another way, the user can export a report when he is viewing its detail (Report
              Detail)
            </p>
            <img
              onClick={() => this.showModal('/assets/images/028.png')}
              className={s.img}
              src="/assets/images/028.png"
              alt="login"
            />
            <p className={s.textLv1}>
              3. The user can also search and export reports in History Tab, searching criteria
              supported: title, description, Date (From &amp; To), report status (DRAFT/ PENDING/
              COMPLETE/ REJECT) and creator email.
            </p>
            <img
              onClick={() => this.showModal('/assets/images/029.png')}
              className={s.img}
              src="/assets/images/029.png"
              alt="login"
            />
            <p className={s.textContent}>
              Note that, if the user is in finance role, via History tab, he has privilege to be
              able to search and export reports of other users (employees) in system.
            </p>
            <ZoomImage handleCancel={this._handleCancel} visible={visible} src={src} />
          </div>
        </Col>
      </Row>
    );
  }
}

export default Exporting;
