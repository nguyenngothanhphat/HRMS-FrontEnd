import React, { PureComponent } from 'react';
import { Row, Col, BackTop } from 'antd';
import s from './index.less';
import ZoomImage from '@/components/ZoomImage';

class CommentingReport extends PureComponent {
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
              The comment feature can be accessed when the approver views a report.
            </p>
            <p className={s.textLv1}>
              <span className={s.strong}>&bull; </span>Go to REPORT &amp; Choosing Need to Review
              tab
            </p>
            <p className={s.textLv1}>
              <span className={s.strong}>&bull; </span>Tap on a PENDING Report to view the detail
            </p>
            <img
              onClick={() => this.showModal('/assets/images/057.png')}
              className={s.img}
              src="/assets/images/057.png"
              alt="report"
            />
            <p className={s.textLv1}>
              <span className={s.strong}>&bull; </span>Tapping on Comment, the COMMENT screen will
              appear and be ready for the user’s comment.
            </p>
            <img
              onClick={() => this.showModal('/assets/images/058.png')}
              className={s.img}
              src="/assets/images/058.png"
              alt="report"
            />
            <p className={s.textContent}>
              After sending a comment on a report, the report will be returned to the creator so
              that he can doublecheck and adjust it if needed, then resubmiting the report for the
              approval again.
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

export default CommentingReport;
