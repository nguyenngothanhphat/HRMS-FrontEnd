import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Button, Form, Select, Spin } from 'antd';

import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import reportIcon from '@/assets/myreport.svg';
import expenseIcon from '@/assets/myexpenses.svg';
import windowSize from 'react-window-size';
import Report from './reportComponent';
import ProjectTag from './components/ProjectTag';
import RecentReport from './components/RecentReport';

import styles from './index.less';

@connect(({ bill, reimbursement, user: { currentUser }, loading, currency, user }) => ({
  bill,
  reimbursement,
  currentUser,
  loading: loading.models.reimbursement,
  expenseLoading: loading.models.bill,
  currency,
  user,
}))
@Form.create()
class Dashboard extends PureComponent {
  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  constructor(props) {
    super(props);
    const currentYear = new Date().getFullYear();
    this.state = {
      loadingSummaryByProject: true,
      loadingSummaryByTag: true,
      loadingSummary: true,
      loadingSummaryReport: true,
      loadingRecentReport: true,
      loadingRecentExpense: true,
      year: currentYear,
    };
  }

  componentDidMount() {
    const { year = new Date().getFullYear() } = this.state;
    this.fetchAllData(year);
  }

  resetLoadingState = () => {
    this.setState({
      loadingSummaryByProject: true,
      loadingSummaryByTag: true,
      loadingSummary: true,
      loadingSummaryReport: true,
      loadingRecentReport: true,
      loadingRecentExpense: true,
    });
  };

  fetchAllData = year => {
    const { dispatch } = this.props;
    // const { year = new Date().getFullYear() } = this.state;
    this.resetLoadingState();
    dispatch({ type: 'reimbursement/fetchAll' });
    dispatch({ type: 'bill/fetchActiveBills' });
    dispatch({ type: 'reimbursement/fetchSummary', payload: { year } }).then(() =>
      this.setState({ loadingSummaryReport: false })
    );
    dispatch({ type: 'reimbursement/fetchRecentReport', payload: { limit: 4, year } }).then(() =>
      this.setState({ loadingRecentReport: false })
    );
    dispatch({ type: 'bill/fetchSummary', payload: { year } }).then(() =>
      this.setState({ loadingSummary: false })
    );
    dispatch({ type: 'bill/fetchSummaryByTag', payload: { limit: 3, order: -1, year } }).then(() =>
      this.setState({ loadingSummaryByTag: false })
    );
    dispatch({ type: 'bill/fetchSummaryByProject', payload: { limit: 3, order: -1, year } }).then(
      () => this.setState({ loadingSummaryByProject: false })
    );
  };

  totalAmount = list => {
    let amount = 0;
    if (list && list.length) {
      list.forEach(item => {
        amount += item.amount;
      });
    }
    return Math.round(amount * 1000) / 1000;
  };

  handleYearChange = year => {
    this.setState({ year });
    this.fetchAllData(year);
  };

  renderYearFilter = () => {
    const { loadingSummary = true, loadingSummaryReport = true } = this.state;
    const year = new Date().getFullYear();
    const dataYear = [year, year - 1, year - 2];
    return (
      <Select
        defaultValue={year}
        className={styles.yearFilter}
        onChange={this.handleYearChange}
        // eslint-disable-next-line no-bitwise
        disabled={loadingSummary || loadingSummaryReport}
      >
        {dataYear.map(item => (
          <Select.Option key={item} value={item}>{`FY ${item}`}</Select.Option>
        ))}
      </Select>
    );
  };

  formatNumber = num => {
    if (num > 1000000000) {
      const billion = num / 1000000000;
      return { precision: 3, suffix: 'B', value: billion };
    }
    if (num > 1000000) {
      const million = num / 1000000;
      return { precision: 3, suffix: 'M', value: million };
    }
    return { precision: 2, suffix: '', value: num };
  };

  getPrefix = () => {
    const {
      currency: { list: listCurrency = [] } = {},
      user: {
        currentUser: { location: { currency: { _id: userCurrency = '' } = {} } = {} } = {},
      } = {},
    } = this.props;

    const currentCurrency = listCurrency.find(item => item._id === userCurrency) || {};
    return currentCurrency.symbol || '';
  };

  render() {
    const {
      bill: {
        list: recentExpenseData = {},
        summaryByTag: summaryByTagData = {},
        summaryByProject: summaryByProjectData = {},
        summary: summaryData = [],
      },
      reimbursement: { summaryReport: summaryReportData = [], recentReport: recentReportData = {} },
      expenseLoading,
      currentUser: { fullName = '' },
      windowWidth,
    } = this.props;
    const {
      loadingSummaryByProject = true,
      loadingSummaryByTag = true,
      loadingSummary = true,
      loadingSummaryReport = true,
      loadingRecentReport = true,
      loadingRecentExpense = true,
    } = this.state;

    const cardInfoContent = (
      <div>
        <div className={styles.emailBox}>
          <div className={styles.titleEmailBox}>
            <FormattedMessage id="dashboard.addons" />
          </div>
          <Button shape="round" style={{ width: '100%', marginBottom: '20px' }}>
            <img alt="gmail" src="/assets/img/google.png" style={{ paddingRight: '10px' }} />
            <FormattedMessage id="dashboard.gmail" />
          </Button>
          <Button shape="round" style={{ width: '100%' }}>
            <img alt="outlook" src="/assets/img/outlook.png" style={{ paddingRight: '10px' }} />
            <FormattedMessage id="dashboard.outlook" />
          </Button>
        </div>
        <div className={styles.emailBox}>
          <div className={styles.titleEmailBox}>
            <FormattedMessage id="dashboard.mobile" />
          </div>
          <Button shape="round" style={{ width: '100%', marginBottom: '20px' }}>
            <img alt="android" src="/assets/img/android.png" style={{ paddingRight: '10px' }} />
            <FormattedMessage id="dashboard.android" />
          </Button>
          <Button shape="round" style={{ width: '100%' }}>
            <img alt="ios" src="/assets/img/ios.png" style={{ paddingRight: '10px' }} />
            <FormattedMessage id="dashboard.ios" />
          </Button>
        </div>
      </div>
    );
    return (
      <div className={styles.dashboard}>
        <div className={styles.titleBlock}>
          <div className={styles.topTitle}>Hi {fullName},</div>
          <div className={styles.yearFilter}>{this.renderYearFilter()}</div>
        </div>
        <div>
          {Object.entries(summaryData).length > 0 ? (
            <Report
              title={formatMessage({ id: 'dashboard.manage.title.expense' })}
              icon={expenseIcon}
              expenses={summaryData}
              formatNumber={this.formatNumber}
              getPrefix={this.getPrefix}
              loading={loadingSummary}
            />
          ) : null}
          {Object.entries(summaryReportData).length > 0 ? (
            <Report
              title={formatMessage({ id: 'dashboard.manage.title.report' })}
              icon={reportIcon}
              reports={summaryReportData}
              formatNumber={this.formatNumber}
              loading={loadingSummaryReport}
              getPrefix={this.getPrefix}
            />
          ) : null}
        </div>

        <Row type="flex" gutter={28}>
          {Object.entries(summaryByProjectData).length > 0 ? (
            <Col span={windowWidth >= 1250 ? 12 : 24}>
              <Spin spinning={loadingSummaryByProject}>
                <ProjectTag
                  key={Math.random()
                    .toString(36)
                    .substr(2, 9)}
                  projectData={summaryByProjectData}
                  formatNumber={this.formatNumber}
                  getPrefix={this.getPrefix}
                />
              </Spin>
            </Col>
          ) : null}
          {Object.entries(summaryByTagData).length > 0 ? (
            <Col span={windowWidth >= 1250 ? 12 : 24}>
              <Spin spinning={loadingSummaryByTag}>
                <ProjectTag
                  key={Math.random()
                    .toString(36)
                    .substr(2, 9)}
                  tagData={summaryByTagData}
                  formatNumber={this.formatNumber}
                  getPrefix={this.getPrefix}
                />
              </Spin>
            </Col>
          ) : null}
        </Row>

        <Spin spinning={loadingRecentReport && loadingRecentExpense}>
          <RecentReport
            reportData={Object.entries(recentReportData).length > 0 ? recentReportData : []}
            expenseData={recentExpenseData}
            formatNumber={this.formatNumber}
            getPrefix={this.getPrefix}
          />
        </Spin>

        <div className={styles.layoutCard}>
          <Row gutter={24} type="flex">
            <Col md={24} />
            <Col md={0}>
              <Card loading={expenseLoading} className={styles.cardMoreInfo}>
                {cardInfoContent}
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default windowSize(Dashboard);
