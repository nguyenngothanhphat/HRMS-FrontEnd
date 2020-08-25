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
              After login successfully to the app, the user can choose REPORTS on left menu to
              access list of reports screen.
            </p>
            <img
              onClick={() => this.showModal('/assets/images/038.png')}
              className={s.img}
              src="/assets/images/038.png"
              alt="report"
            />
            <p className={s.textContent}>The ALL REPORTS screen will be displayed with 3 tabs</p>
            <p className={s.textLv1}>
              <span className={s.strong}>&bull; My Reports</span>: listing all reports that were
              requested by the user with current status (Draft/ Pending/ Complete/ Reject)
            </p>
            <p className={s.textLv1}>
              <span className={s.strong}>&bull; Need to Review</span>: listing all reports that were
              submitted by the user’s team member and these reports are being in PENDING for the
              user’s review and approval.
            </p>
            <p className={s.textLv1}>
              <span className={s.strong}>&bull; History</span>: showing all historical actions &amp;
              status of the user’s reports
            </p>
            <img
              onClick={() => this.showModal('/assets/images/054.png')}
              className={s.img}
              src="/assets/images/054.png"
              alt="report"
            />
            <p className={s.textContent}>
              Tapping on CREATE NEW REPORT, the Add New Report Form will appear with required
              fields:
            </p>
            <p className={s.textLv1}>
              <span className={s.strong}>&bull; Title</span>: text field is for Report title
            </p>
            <p className={s.textLv1}>
              <span className={s.strong}>&bull; Expense list</span>: listing out all unreported
              expenses that were created but currently not added to any reports; the user should
              select at least one expense to create a valid report
            </p>
            <p className={s.textLv1}>
              <span className={s.strong}>&bull; </span>Click <span className={s.strong}>Save </span>
              to submit the report to direct manager
            </p>
            <img
              onClick={() => this.showModal('/assets/images/055.png')}
              className={s.img}
              src="/assets/images/055.png"
              alt="report"
            />
            <p className={s.textContent}>
              After submitted, the report will be in request queue of the user and will be in
              approval queue of direct manager. Next, the direct manager will review and
              approve/reject the report according to approval flow.
            </p>
            <img
              onClick={() => this.showModal('/assets/images/056.png')}
              className={s.img}
              src="/assets/images/056.png"
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

export default NewReport;
