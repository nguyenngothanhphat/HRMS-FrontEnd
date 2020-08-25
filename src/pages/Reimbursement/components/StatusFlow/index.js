import React, { Component } from 'react';
import { Icon, Steps } from 'antd';
import Media from 'react-media';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './index.less';

const StepItem = Steps.Step;
class StatusFlow extends Component {
  statusStep = 'process';

  currentIndex = 0;

  processSteps = () => {
    const { item } = this.props;
    if (!item.status) return;
    const { status, user: currentUser = {}, assign = {} } = item;
    const list = {
      pending: formatMessage({ id: 'reimbursement.report-detail.status-flow.submit' }),
      manager: formatMessage({ id: 'reimbursement.report-detail.status-flow.manager' }),
      dep: formatMessage({ id: 'reimbursement.report-detail.status-flow.finance-department' }),
      lead: formatMessage({ id: 'reimbursement.report-detail.status-flow.finance-lead' }),
      work: formatMessage({ id: 'reimbursement.report-detail.status-flow.finance-worklist' }),
    };
    const { location: { financiers = {}, emailFinanciers = {} } = {}, manager } = currentUser;
    let icon;
    this.steps = Object.keys(list).map((position, index) => {
      icon = undefined;
      const { status: statusAssign, user: assignUser } = assign[position] || {};
      let user = assignUser;
      if (!assignUser) {
        user =
          financiers[position] ||
          (emailFinanciers[position] ? { fullName: emailFinanciers[position] } : currentUser);
        if (position === 'manager') user = manager;
      }

      switch (statusAssign) {
        case 'REJECT':
          this.currentIndex = index;
          break;
        case 'NEED_MORE_INFO':
          icon = <Icon style={{ fontSize: '32px' }} type="question-circle" />;
          break;
        default:
          break;
      }

      return {
        title: list[position],
        key: position,
        icon,
        ...(user && {
          description: (position === 'manager' || position === 'pending') && user.fullName,
        }),
      };
    });
    switch (status) {
      case 'COMPLETE':
        this.statusStep = 'finish';
        this.currentIndex = 4;
        break;
      case 'DRAFT':
        this.statusStep = 'process';
        this.currentIndex = 0;
        break;
      case 'REJECT':
        this.statusStep = 'error';
        break;
      case 'PENDING':
        if (icon) this.currentIndex = 0;
        else this.currentIndex = 1;
        break;
      default:
        this.currentIndex = Object.keys(list).indexOf(status.toLowerCase()) + 1;
        break;
    }
  };

  render() {
    const { isMobile } = this.props;
    this.processSteps();
    const { steps = [], currentIndex, statusStep } = this;
    return (
      <Steps
        direction={isMobile ? 'vertical' : 'horizontal'}
        className={styles.root}
        labelPlacement="vertical"
        current={currentIndex}
        status={statusStep}
      >
        {steps.map(step => {
          return <StepItem {...step} />;
        })}
      </Steps>
    );
  }
}

export default props => (
  <Media query="(max-width: 599px)">
    {isMobile => <StatusFlow {...props} isMobile={isMobile} />}
  </Media>
);
