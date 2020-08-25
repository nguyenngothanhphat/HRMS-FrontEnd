import React, { PureComponent } from 'react';
import { Row, Col, BackTop } from 'antd';
import Link from 'umi/link';
import s from './index.less';
import ZoomImage from '@/components/ZoomImage';

class ApprovalRejectReport extends PureComponent {
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
              According to&nbsp;
              <Link to="/question-and-answer/userrole-approvalflow/approval">Approval Flow</Link>,
              if the user are one of these role: Direct Manager/Finance Department/Finance Lead/
              Finance Worklist, he could have privilege actions (Approve/Reject/Comment) on upcoming
              report in his approval queue (Need to Review).
            </p>
            <img
              onClick={() => this.showModal('/assets/images/054.png')}
              className={s.img}
              src="/assets/images/054.png"
              alt="report"
            />
            <p className={s.textContent}>
              In order to do approval tasks, the user can access “Need to Review” tab in ALL REPORTS
              to have all PENDING reports that need his review &amp; approvals
            </p>
            <img
              onClick={() => this.showModal('/assets/images/055.png')}
              className={s.img}
              src="/assets/images/055.png"
              alt="report"
            />
            <p className={s.textContent}>
              When the user selects reports for multiple approval, Reject and Approve buttons will
              appear:
            </p>
            <img
              onClick={() => this.showModal('/assets/images/056.png')}
              className={s.img}
              src="/assets/images/056.png"
              alt="report"
            />
            <p className={s.textContent}>
              Tapping on Reject/Approve button, the report will be rejected or approved according to
              the approval flow.
            </p>
            <p className={s.textContent}>
              Beside multiple approval, the user can do single approval when viewing report detail.
              Tapping on a report from the list to go to report detail.
            </p>
            <img
              onClick={() => this.showModal('/assets/images/057.png')}
              className={s.img}
              src="/assets/images/057.png"
              alt="report"
            />
            <p className={s.textContent}>
              According to Approval Flow, when user approves a report, it will be automatically
              assigned to another one who is on the next stage of the flow. In case of rejection,
              the flow of approval of the report will be stopped, then the creator (employee) should
              doublecheck report content and review approver’s comments to see if any adjustment
              needed for re-submission.
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

export default ApprovalRejectReport;
