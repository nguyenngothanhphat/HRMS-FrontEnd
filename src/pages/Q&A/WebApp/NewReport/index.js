import React, { PureComponent } from 'react';
import { Row, Col, BackTop } from 'antd';
import s from './index.less';
import ZoomImage from '@/components/ZoomImage';

class NewReport extends PureComponent {
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
              From Reports page, choosing Request tab and click on “NEW REPORT” button
            </p>
            <img
              onClick={() => this.showModal('/assets/images/016.png')}
              className={s.img}
              src="/assets/images/016.png"
              alt="new report"
            />
            <p className={s.textContent}>
              The Add New Report Form will appear with required fields:
            </p>
            <img
              onClick={() => this.showModal('/assets/images/017.png')}
              className={s.img}
              src="/assets/images/017.png"
              alt="new report"
            />
            <p className={s.textLv1}>
              <span className={s.strong}>&bull; Title</span>: text field is for Report title
            </p>
            <p className={s.textLv1}>
              <span className={s.strong}>&bull; Expense list</span>: listing out all unreported
              expenses that were created but currently not added to any reports; the user should
              select at least one expense to create a valid report
            </p>
            <p className={s.textLv1}>&bull; In order to submit the report there are 2 options:</p>
            <p className={s.textLv2}>
              1. <span className={s.strong}>Check “Save Draft” and click “Create New” button</span>:
              the report will be in draft status, not submitted to direct manager to approve yet.
              The user can double check report content and finally submit it when he is confident.
            </p>
            <p className={s.textLv2}>
              2.
              <span className={s.strong}> Uncheck “Save Draft” and click “Create New” button</span>:
              right away, the report will be submitted and the user’s direct manager will be
              notified by email for approval.
            </p>
            <img
              onClick={() => this.showModal('/assets/images/019.png')}
              className={s.img}
              src="/assets/images/019.png"
              alt="new report"
            />
            <p className={s.textContent}>
              After submitted, the report will be in request queue of the user and will be in
              approval queue of direct manager. Next, the direct manager will review and
              approve/reject the report according to approval flow.
            </p>
            <img
              onClick={() => this.showModal('/assets/images/004.png')}
              className={s.img}
              src="/assets/images/018.png"
              alt="new report"
            />
            <ZoomImage handleCancel={this._handleCancel} visible={visible} src={src} />
          </div>
        </Col>
      </Row>
    );
  }
}

export default NewReport;
