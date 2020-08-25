import React, { PureComponent } from 'react';
import { Row, Col, Icon, BackTop } from 'antd';
import Link from 'umi/link';
import s from './index.less';
import ZoomImage from '@/components/ZoomImage';

class ApprovingRejectingReport extends PureComponent {
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
              report in his approval queue.
            </p>
            <p className={s.textContent}>
              In order to do approval tasks, the user can check the approval list in Report menu to
              search the reports that he wants to take actions.
            </p>
            <img
              onClick={() => this.showModal('/assets/images/021.png')}
              className={s.img}
              src="/assets/images/021.png"
              alt="report"
            />
            <p className={s.textContent}>There are 3 ways to do approval for a report:</p>
            <p className={s.textLv1}>
              1. In approval queue, at each of item in repost list, the user can choose actions
              (Approve or Reject) at ACTION column to do an approval for one by one report.
            </p>
            <img
              onClick={() => this.showModal('/assets/images/022.png')}
              className={s.img}
              src="/assets/images/022.png"
              alt="report"
            />
            <p className={s.textLv1}>2. The user can also do the approval in report detail.</p>
            <p className={s.textLv2}>
              <span>+ Clicking on icon&nbsp;</span>
              <Icon type="eye" theme="filled" />
              <span>&nbsp;of action column to access report detail;</span>
            </p>
            <p className={s.textLv2}>
              + then choosing an action from action list of report detail page.
            </p>
            <img
              onClick={() => this.showModal('/assets/images/023.png')}
              className={s.img}
              src="/assets/images/023.png"
              alt="report"
            />
            <p className={s.textLv1}>
              3. The user can also do approvals for multiple reports, from approval queue page:
            </p>
            <p className={s.textLv2}>+ Select multiple reports that he want to take actions</p>
            <img
              onClick={() => this.showModal('/assets/images/025.png')}
              className={s.img}
              src="/assets/images/025.png"
              alt="report"
            />
            <p className={s.textLv2}>
              + Click on Action Button to apply an action on selected report
            </p>
            <img
              onClick={() => this.showModal('/assets/images/024.png')}
              className={s.img}
              src="/assets/images/024.png"
              alt="report"
            />
            <p className={s.textContent}>
              According to Approval Flow, when user approves a report, it will be automatically
              assigned to another one who is on the next stage of the flow. In case of rejection,
              the flow of approval of the report will be stopped, then the creator (employee) should
              doublecheck report content and review approver’s comments to see if any adjustment
              needed for re-submission.
            </p>
            <ZoomImage handleCancel={this._handleCancel} visible={visible} src={src} />
          </div>
        </Col>
      </Row>
    );
  }
}

export default ApprovingRejectingReport;
