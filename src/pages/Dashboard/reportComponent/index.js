/* eslint-disable no-param-reassign */
import React, { PureComponent } from 'react';
import _ from 'lodash';
import { Row, Col, Tooltip, Statistic, notification, List } from 'antd';
import { connect } from 'dva';
import Link from 'umi/link';
import { formatMessage } from 'umi-plugin-react/locale';

import styles from './index.less';

@connect(({ loading, currency, user }) => ({
  loadingCurrency: loading.effects['currency/fetch'],
  currency,
  user,
}))
class ReportComponent extends PureComponent {
  listAnimationIds = [];

  intervals = [];

  timeouts = [];

  constructor(props) {
    super(props);
    this.listAnimationIds = [];
  }

  componentWillUnmount() {
    this.listAnimationIds = [];
  }

  renderTitle = key => {
    let title = '';
    switch (key) {
      case 'reimbursable':
        title = 'Reimbursable';
        break;
      case 'billable':
        title = 'Client Billable';
        break;
      case 'unReport':
        title = 'Unreported';
        break;
      case 'companyCash':
        title = 'Company Cash';
        break;
      case 'companyCC':
        title = 'Company CC';
        break;
      case 'ALL':
        title = 'All Reports';
        break;
      case 'REJECT':
        title = 'Rejected';
        break;
      case 'DRAFT':
        title = 'Draft';
        break;
      case 'INQUIRY':
        title = 'Inquiry';
        break;
      case 'REPORTED':
      case 'PENDING':
        title = 'Reported';
        break;
      case 'COMPLETE':
        title = 'Completed';
        break;
      default:
        title = '';
        break;
    }
    return title;
  };

  setListAnimation = (id, amount) => {
    const item = _.filter(this.listAnimationIds, { id });
    if (item.length < 1) {
      this.listAnimationIds.push({ id, amount });
    }
  };

  renderExpenseContent = (item, key, index) => {
    const { formatNumber, getPrefix } = this.props;
    const classNameResponsive = `intranet-pages-dashboard-report-component-index-db_report_responsive_${index}`;
    const dynamicId = Math.random()
      .toString(36)
      .substr(2, 9);
    this.setListAnimation(dynamicId, item.amount);
    let content = null;
    if (Object.entries(item).length > 0) {
      content = (
        <div className={`${styles.db_report_item} ${classNameResponsive}`} key={index}>
          <Tooltip
            title={`${getPrefix()} ${item.amount
              .toFixed(2)
              .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
            `}
            placement="top"
          >
            <Statistic
              className={`${styles.price} ${dynamicId}`}
              value={formatNumber(item.amount).value}
              prefix={getPrefix()}
              suffix={formatNumber(item.amount).suffix}
              precision={formatNumber(item.amount).precision}
            />
            <div className={styles.db_report_item_span}>
              {this.renderTitle(key)} ({item.count})
            </div>
          </Tooltip>
        </div>
      );
    }
    return content;
  };

  renderReportContent = (item, key, index) => {
    const { formatNumber, getPrefix } = this.props;
    const classNameResponsive = `intranet-pages-dashboard-report-component-index-db_report_responsive_${index}`;
    const dynamicId = Math.random()
      .toString(36)
      .substr(2, 9);
    this.setListAnimation(dynamicId, item.totalAmount);
    let content = null;
    if (Object.entries(item).length > 0) {
      content = (
        <div className={`${styles.db_report_item} ${classNameResponsive}`} key={index}>
          <Tooltip
            title={`${getPrefix()} ${item.totalAmount
              .toFixed(2)
              .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
            `}
            placement="top"
          >
            <Statistic
              className={`${styles.price} ${dynamicId}`}
              value={formatNumber(item.totalAmount).value}
              prefix={getPrefix()}
              suffix={formatNumber(item.totalAmount).suffix}
              precision={formatNumber(item.totalAmount).precision}
            />
            <div className={styles.db_report_item_span}>
              {this.renderTitle(key)} ({item.reportCount})
            </div>
          </Tooltip>
        </div>
      );
    }
    return content;
  };

  renderExpenseContents = data => {
    let content = [];
    if (Object.entries(data).length > 0) {
      content = [
        data.unReport ? this.renderExpenseContent(data.unReport, 'unReport', 1) : null,
        data.billable ? this.renderExpenseContent(data.billable, 'billable', 2) : null,
        data.reimbursable ? this.renderExpenseContent(data.reimbursable, 'reimbursable', 3) : null,
        data.companyCash ? this.renderExpenseContent(data.companyCash, 'companyCash', 4) : null,
        data.companyCC ? this.renderExpenseContent(data.companyCC, 'companyCC', 5) : null,
      ];
    }
    return content;
  };

  renderReportContents = data => {
    let content = [];
    if (Object.entries(data).length > 0) {
      content = [
        data.ALL ? this.renderReportContent(data.ALL, 'ALL', 1) : null,
        data.PENDING || data.REPORTED
          ? this.renderReportContent(data.PENDING ? data.PENDING : data.REPORTED, 'PENDING', 2)
          : null,
        data.COMPLETE ? this.renderReportContent(data.COMPLETE, 'COMPLETE', 3) : null,
        data.INQUIRY ? this.renderReportContent(data.INQUIRY, 'INQUIRY', 4) : null,
        data.DRAFT ? this.renderReportContent(data.DRAFT, 'DRAFT', 5) : null,
      ];
    }
    return content;
  };

  clearAllIntervals = () => {
    this.intervals.forEach(clearInterval);
    this.intervals = [];
    this.clearTimeouts();
  };

  clearTimeouts = () => {
    this.timeouts.forEach(clearTimeout);
    this.timeouts = [];
  };

  runAnimationAmount = listAnimationId => {
    const { formatNumber } = this.props;
    listAnimationId.map(itemAnimation => {
      const elem = document.getElementsByClassName(itemAnimation.id)[0];
      if (elem) {
        const priceObj = elem.getElementsByClassName('ant-statistic-content-value-int')[0];
        const decimalObj = elem.getElementsByClassName('ant-statistic-content-value-decimal')[0];
        const suffixObj = elem.getElementsByClassName('ant-statistic-content-suffix')[0];
        if (decimalObj) {
          decimalObj.style.display = 'none';
        }
        if (suffixObj) {
          suffixObj.style.display = 'none';
        }
        const finalPrice =
          priceObj.innerHTML > 0
            ? priceObj.innerHTML
            : Math.floor(formatNumber(itemAnimation.amount).value)
                .toString()
                .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        let value = 0;
        priceObj.innerHTML = value;

        this.intervals.push(
          setInterval(() => {
            const target = Math.floor(itemAnimation.amount);
            const frame = () => {
              if (value >= target) {
                priceObj.innerHTML = finalPrice;
                if (decimalObj) {
                  decimalObj.style.display = 'unset';
                }
                if (suffixObj) {
                  suffixObj.style.display = 'unset';
                }
                this.timeouts.push(setTimeout(this.clearAllIntervals, 4000));
              } else {
                value += Math.ceil(target * 0.1);
                priceObj.innerHTML = value
                  ? value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
                  : value;
              }
            };
            this.intervals.push(setInterval(frame, 100));
          }, 800)
        );
      }
      return itemAnimation;
    });
  };

  isAllowAddReport = () => {
    const { user: { currentUser = {} } = {} } = this.props;
    return !!currentUser.manager;
  };

  showError = error => {
    notification.error({
      message: 'Process fail',
      description: (
        <List
          size="small"
          dataSource={[error]}
          renderItem={msg => <List.Item key={msg}>{msg}</List.Item>}
        />
      ),
    });
  };

  getLinkPage = expenses => {
    let result = Object.entries(expenses).length > 0 ? '/expense/newexpense' : '';
    if (!result) {
      result = this.isAllowAddReport() ? '/report/new' : '#';
    }
    return result;
  };

  render() {
    const { title = '', icon = '', expenses = [], reports = [] } = this.props;
    this.clearAllIntervals();
    return (
      <div className={styles.db_report_component}>
        <Row className={styles.db_report_content}>
          <Col className={styles.db_report_title}>
            <ul>
              <li>
                <ul className={styles.db_report_link}>
                  <li>
                    <span style={{ margin: '0' }}>{title || ''}</span>
                  </li>
                  <li>
                    <Link
                      to={Object.entries(expenses).length > 0 ? '/expense' : '/report'}
                      className={styles.db_report_umi_link}
                    >
                      {formatMessage({ id: 'dashboard.manage' })}
                    </Link>
                    <Link
                      to={this.getLinkPage(expenses)}
                      className={styles.db_report_umi_link}
                      onClick={() => {
                        // eslint-disable-next-line no-unused-expressions
                        this.isAllowAddReport()
                          ? ''
                          : this.showError(
                              formatMessage({ id: 'dashboard.errorMessage.withoutManager' })
                            );
                      }}
                    >
                      {formatMessage({ id: 'dashboard.add' })}
                    </Link>
                  </li>
                </ul>
              </li>
              <li>
                <img alt="" src={icon} />
              </li>
            </ul>
          </Col>
          <Col className={styles.bd_report_items}>
            {Object.entries(expenses).length > 0 ? this.renderExpenseContents(expenses) : null}
            {Object.entries(reports).length > 0 ? this.renderReportContents(reports) : null}
            {Object.entries(expenses).length > 0 || Object.entries(reports).length > 0
              ? this.runAnimationAmount(this.listAnimationIds)
              : null}
          </Col>
        </Row>
      </div>
    );
  }
}

export default ReportComponent;
