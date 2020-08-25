import React, { PureComponent } from 'react';
import { Row, Col, BackTop } from 'antd';
import s from './index.less';
import ZoomImage from '@/components/ZoomImage';

class CommentReport extends PureComponent {
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
              As a part of Approval Flow, the approver is able to comment on report to ask for more
              input or information from the creator.
            </p>
            <p className={s.textContent}>
              The comment feature can be accessed in Report Detail page
            </p>
            <p className={s.textLv1}>&bull; Go to Report Details</p>
            <p className={s.textLv1}> &bull; Click on Action Button and choose comment</p>
            <img
              onClick={() => this.showModal('/assets/images/026.png')}
              className={s.img}
              src="/assets/images/026.png"
              alt="login"
            />
            <p className={s.textLv1}>
              &bull; A right side popup will appear to show all historical comments and allow the
              user to input his own one.
            </p>
            <img
              onClick={() => this.showModal('/assets/images/059.png')}
              className={s.img}
              src="/assets/images/059.png"
              alt="login"
            />
            <p className={s.textContent}>
              After sending a comment on a report, the report will be returned to the creator so
              that he can doublecheck and adjust it if needed, then resubmiting the report for the
              approval again.
            </p>
            <ZoomImage handleCancel={this._handleCancel} visible={visible} src={src} />
          </div>
        </Col>
      </Row>
    );
  }
}

export default CommentReport;
