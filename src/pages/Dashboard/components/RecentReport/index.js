import React, { PureComponent } from 'react';
import { Tabs, Row, Col, Statistic, Steps, Popover, Tooltip } from 'antd';
import ExpenseTable from '@/components/ExpenseTable';
import addExpenseIcon from '@/assets/svg/add_expense.svg';
// import { connect } from 'dva';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import { formatMessage } from 'umi-plugin-react/locale';
import { Link } from 'umi';
import styles from './index.less';

const { Step } = Steps;

const { TabPane } = Tabs;
const moment = extendMoment(Moment);

class RecentReport extends PureComponent {
  callbackTabRecentForm = key => {
    return key;
  };

  getNameStatusByKey = key => {
    let name = 'wait';
    switch (key) {
      case 'REJECT':
        name = 'Rejected';
        break;
      case 'DRAFT':
        name = 'Draft';
        break;
      case 'INQUIRY':
        name = 'Inquiry';
        break;
      case 'REPORTED':
      case 'PENDING':
        name = 'Reported';
        break;
      case 'COMPLETE':
        name = 'Completed';
        break;
      default:
        break;
    }
    return name;
  };

  getDescription = data => {
    let description = ' ';
    switch (data.status) {
      case 'ACTIVE':
      case 'DRAFT':
        description = '';
        break;
      case 'REJECT':
        if (data.stepIndex <= data.approvalStep) {
          description = data.stepIndex < data.approvalStep ? 'Approved' : 'Rejected';
        }
        break;
      case 'INQUIRY':
        if (data.stepIndex <= data.approvalStep) {
          description = data.stepIndex < data.approvalStep ? 'Approved' : 'Sent Back';
        }
        break;
      case 'REPORTED':
      case 'PENDING':
        if (data.stepIndex <= data.approvalStep) {
          description = 'Approved';
        } else {
          description = data.stepIndex - 1 === data.approvalStep ? 'Pending Approval' : '';
        }
        break;
      case 'COMPLETE':
        description = 'Approved';
        break;
      default:
        break;
    }
    return description;
  };

  getDescriptionPopup = (data, status) => {
    let description = ' ';
    switch (status) {
      case 'REJECT':
        description =
          data.type === 'none' ? `${data.value} Rejected` : `${data.data.name} Rejected`;
        break;
      case 'DRAFT':
        break;
      case 'INQUIRY':
        description =
          data.type === 'none'
            ? `${data.value} asked for more info`
            : `${data.data.name} asked for more info`;
        break;
      case 'REPORTED':
      case 'PENDING':
        description =
          data.type === 'none'
            ? `Pending Approval by ${data.value}`
            : `Pending Approval by ${data.data.name}`;
        break;
      case 'COMPLETE':
        break;
      default:
        break;
    }
    return description;
  };

  getStepTitle = params => {
    let result = params.item ? params.item.value : '';
    if (params.item && params.item.type !== 'none') {
      result = params.item.data.name;
    } else {
      result = params.data.manager.fullName;
    }
    return result;
  };

  renderSteps = data => {
    return data.approvalFlow.nodes.map((item, index) => (
      <Step
        key={item._id}
        title={this.getStepTitle({ item, data })}
        status={data.approvalStep - 1 === index ? this.getNameStatusByKey(data.status) : null}
        description={this.getDescription({
          status: data.status,
          stepIndex: index,
          approvalStep: data.approvalStep - 1,
        })}
        descriptionpopup={
          data.approvalStep - 1 === index && item ? this.getDescriptionPopup(item, data.status) : ''
        }
        itemdata={data}
      />
    ));
  };

  customDot = (dot, attribute) => {
    const itemProps = dot._owner.pendingProps;
    return attribute.description ? (
      <Popover
        placement="bottom"
        content={
          <span
            className={`${styles.popover} ${styles[attribute.status]}`}
            style={{ display: 'block' }}
          >
            <div>{attribute.status ? `Status: ${attribute.status}` : ' '}</div>
            <div>{itemProps.descriptionpopup}</div>
            <div className={styles.arrow} />
          </span>
        }
      >
        {dot}
      </Popover>
    ) : (
      dot
    );
  };

  renderFirstPointStep = data => {
    let result = '';
    if (data) {
      switch (data.status.toUpperCase()) {
        case 'ACTIVE':
          result = 'Add New Report';
          break;
        case 'DRAFT':
          result = 'Saved Draft';
          break;
        default:
          result = 'Submitted Report';
          break;
      }
      return <Steps.Step title={result} description="" itemdata={data} />;
    }
    return result;
  };

  renderFlow = data => {
    return (
      <Steps
        className={[styles.stepsNavi, styles[this.getNameStatusByKey(data.status)]].join(' ')}
        size="small"
        progressDot={this.customDot}
        current={data.approvalStep}
      >
        {this.renderFirstPointStep(data)}
        {this.renderSteps(data)}
      </Steps>
    );
  };

  renderHeaderReport = data => {
    const { formatNumber, getPrefix } = this.props;
    return (
      <Row className={[styles.headerBlock].join(' ')}>
        <Col span={9} className={['gutter-row', styles.itemLabel].join(' ')}>
          <div className={[styles.title, styles.pl_12].join(' ')}>
            <Tooltip title={data.title} placement="top">
              {data.title}
            </Tooltip>
          </div>
        </Col>
        <Col span={5} className={['gutter-row', styles.itemLabel, styles.itemExpense].join(' ')}>
          <div className={[styles.item, styles.item_top].join(' ')}>
            {formatMessage({ id: 'dashboard.recent-reports.expenses' })} (
            <span className={[styles.item].join(' ')}>{data.bills.length}</span>)
          </div>
        </Col>
        <Col span={5} className={['gutter-row', styles.itemLabel, styles.item_top].join(' ')}>
          {formatMessage({ id: 'dashboard.recent-reports.date' })}
          <span className={[styles.item, styles.item_top].join(' ')}>
            {` ${moment(data.updatedAt).format('MMM DD, YYYY')}`}
          </span>
        </Col>
        <Col
          span={5}
          className={[
            'gutter-row',
            styles.itemLabel,
            styles.itemPrice,
            styles.textAlignRight,
            styles.pr_14,
          ].join(' ')}
        >
          <Statistic
            className={[styles.item].join(' ')}
            value={formatNumber(data.amount).value}
            prefix={getPrefix()}
            suffix={formatNumber(data.amount).suffix}
            precision={formatNumber(data.amount).precision}
          />
        </Col>
      </Row>
    );
  };

  renderReport = data => {
    return (
      <div
        key={Math.random()
          .toString(36)
          .substr(2, 9)}
        className={[styles.recentReports].join(' ')}
      >
        {this.renderHeaderReport(data)}
        <Row className={[styles.content].join(' ')}>{this.renderFlow(data)}</Row>
      </div>
    );
  };

  renderRecentReport = reportData => {
    let recentReport = reportData.map(item => this.renderReport(item));
    if (recentReport.length < 1) {
      recentReport = (
        <Row className={styles.recentEmptyBlocks}>
          <Link className={styles.emptyLink} to="/report/new">
            <img className={styles.emptyIcon} alt="" src={addExpenseIcon} />
          </Link>
          <div className={styles.emptyText}>
            {formatMessage({ id: 'dashboard.recent-reports.empty-reports' })}
          </div>
        </Row>
      );
    }
    return recentReport;
  };

  renderRecentExpenseTable = expenseData => {
    let recentExpenseTable = (
      <ExpenseTable list={expenseData} pagination={false} rowSelection={null} />
    );
    if (expenseData.length < 1) {
      recentExpenseTable = (
        <Row className={styles.recentEmptyBlocks}>
          <Link className={styles.emptyLink} to="/expense/newexpense">
            <img className={styles.emptyIcon} alt="" src={addExpenseIcon} />
          </Link>
          <div className={styles.emptyText}>
            {formatMessage({ id: 'dashboard.recent-reports.empty-expenses' })}
          </div>
        </Row>
      );
    }
    return recentExpenseTable;
  };

  render() {
    const { reportData = [], expenseData = [] } = this.props;

    return (
      <Tabs
        defaultActiveKey="1"
        onChange={this.callbackTabRecentForm}
        className={styles.tabRecentForm}
      >
        <TabPane
          className={[styles.recentBlock].join(' ')}
          tab={formatMessage({ id: 'dashboard.recent-reports.recent-reports' })}
          key="1"
        >
          {this.renderRecentReport(reportData)}
        </TabPane>
        <TabPane
          tab={formatMessage({ id: 'dashboard.recent-reports.recent-expenses' })}
          key="2"
          className={[styles.recentBlock].join(' ')}
        >
          {this.renderRecentExpenseTable(expenseData)}
        </TabPane>
      </Tabs>
    );
  }
}

export default RecentReport;
