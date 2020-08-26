import React, { PureComponent } from 'react';
import { Row, Col, Button } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import router from 'umi/router';
import withRouter from 'umi/withRouter';
import PageLoading from '@/components/PageLoading';
import EmployeeDetail from './component/EmployeeDetail';
import PaymentSummary from './component/PaymentSummary';

import styles from './index.less';

@connect(({ payment, currency: { list = [] }, user: { currentUser = {} }, reimbursement }) => ({
  payment,
  currency: list,
  currentUser,
  reimbursement,
}))
class PaymentDetail extends PureComponent {
  componentDidMount() {
    const {
      dispatch,
      reimbursement,
      match: {
        params: { payId },
      },
    } = this.props;
    if (!payId.includes('queue_')) {
      dispatch({ type: 'payment/fetchById', payload: { id: payId } });
    } else if (Object.keys(reimbursement.selectedReportPaid).length > 0) {
      sessionStorage.removeItem('paymentQueue');
      sessionStorage.setItem('paymentQueue', JSON.stringify(reimbursement.selectedReportPaid));
    } else if (Object.keys(reimbursement.selectedReportPaid).length <= 0) {
      const sessionData = sessionStorage.getItem('paymentQueue');
      if (sessionData) {
        const paymentData = JSON.parse(sessionData);
        const userId = payId.replace('queue_', '');
        if (paymentData.user && paymentData.user === userId) {
          dispatch({ type: 'reimbursement/paymentData', payload: paymentData });
        } else {
          router.push('/payment');
        }
      } else {
        router.push('/payment');
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      dispatch,
      payment,
      reimbursement: { item = false, selectedReportPaid = {} },
      match: {
        params: { payId },
      },
    } = nextProps;
    if (!payId.includes('queue_')) {
      if (payment.item && !item) {
        const { reportIds = [] } = payment.item;
        if (reportIds.length > 0) {
          dispatch({ type: 'reimbursement/fetchItem', payload: { reId: reportIds[0]._id || '' } });
        }
      }
    } else if (Object.keys(selectedReportPaid).length > 0) {
      if (selectedReportPaid.listReport && !item) {
        if (selectedReportPaid.listReport.length > 0) {
          dispatch({
            type: 'reimbursement/fetchItem',
            payload: { reId: selectedReportPaid.listReport[0]._id || '' },
          });
        }
      }
    }
  }

  getCurrency = () => {
    const {
      currency = [],
      payment: {
        item: { reportIds = [] },
      },
      match: {
        params: { payId },
      },
      reimbursement: { selectedReportPaid = {} },
      currentUser: {
        location: {
          currency: { symbol = '$' },
        },
      },
    } = this.props;
    if (!payId.includes('queue_')) {
      if (reportIds.length > 0 && reportIds[0] && reportIds[0].currency) {
        const currencySymbol = currency.filter(nItem => {
          return nItem._id === reportIds[0].currency;
        });
        return (currencySymbol[0] && currencySymbol[0].symbol) || '$';
      }
    } else if (selectedReportPaid.listReport && selectedReportPaid.listReport.length > 0) {
      if (selectedReportPaid.listReport[0] && selectedReportPaid.listReport[0].currency) {
        const currencySymbol = currency.filter(nItem => {
          return nItem._id === selectedReportPaid.listReport[0].currency;
        });
        return (currencySymbol[0] && currencySymbol[0].symbol) || '$';
      }
    }
    return symbol || '$';
  };

  onCancel = () => {
    router.push('/payment');
  };

  onMarkPaid = () => {
    const {
      dispatch,
      reimbursement: {
        selectedReportPaid: {
          reportIds = [],
          user = '',
          finance = '',
          amount = 0,
          reimbursable = 0,
          location = '',
          listReport = [],
        },
      },
    } = this.props;
    const currency =
      listReport.length > 0 && listReport[0] && listReport[0].currency
        ? listReport[0].currency
        : 'USD';
    const data = {
      reportIds,
      user,
      finance,
      amount,
      reimbursable,
      location,
      currency,
    };
    dispatch({ type: 'payment/markPaid', payload: data });
  };

  render() {
    const {
      payment: {
        item = {},
        item: { user = {}, code = '', reimbursable = 0 },
      },
      reimbursement,
      reimbursement: { selectedReportPaid = {} },
      currentUser: { appRole = '', id },
      match: {
        params: { payId },
      },
    } = this.props;

    const isQueue = payId.includes('queue_') && Object.keys(selectedReportPaid).length > 0;
    const currency = this.getCurrency();
    const isFinance = appRole === 'FINANCE' && user.id !== id;

    const employeeInfo = {
      name: user.fullName || user.firstName || '',
      id: user.employeeId || '',
      company:
        (reimbursement.item && reimbursement.item.company && reimbursement.item.company.name) || '',
      location:
        (reimbursement.item && reimbursement.item.location && reimbursement.item.location.name) ||
        '',
      department: user.department || '',
      email: user.email || '',
      phone: user.phone || '',
      manager:
        (reimbursement.item && reimbursement.item.manager && reimbursement.item.manager.fullName) ||
        '',
    };

    const haveDataUser =
      selectedReportPaid.listReport &&
      selectedReportPaid.listReport.length > 0 &&
      selectedReportPaid.listReport[0] &&
      selectedReportPaid.listReport[0].user;

    const employeeInfoQueue = {
      name:
        (haveDataUser && selectedReportPaid.listReport[0].user.fullName) ||
        (haveDataUser && selectedReportPaid.listReport[0].user.firstName) ||
        '',
      id: (haveDataUser && selectedReportPaid.listReport[0].user.employeeId) || '',
      company:
        (reimbursement.item && reimbursement.item.company && reimbursement.item.company.name) || '',
      location:
        (reimbursement.item && reimbursement.item.location && reimbursement.item.location.name) ||
        '',
      department: (haveDataUser && selectedReportPaid.listReport[0].user.department) || '',
      email: (haveDataUser && selectedReportPaid.listReport[0].user.email) || '',
      phone: (haveDataUser && selectedReportPaid.listReport[0].user.phone) || '',
      manager:
        (reimbursement.item && reimbursement.item.manager && reimbursement.item.manager.fullName) ||
        '',
    };

    const payment = {
      code,
      reimbursable,
      currency,
    };

    const paymentQueue = {
      code: '',
      reimbursable: selectedReportPaid.reimbursable,
      currency,
    };

    return (item && item.id === payId) || isQueue ? (
      <Row className={styles.payment_detail}>
        <Col span={14} className={styles.payment_detail_employee}>
          <EmployeeDetail employee={isQueue ? employeeInfoQueue : employeeInfo} />
        </Col>
        <Col span={10} className={styles.payment_detail_payment}>
          <Row>
            <Col span={24}>
              <PaymentSummary payment={isQueue ? paymentQueue : payment} />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              {isFinance && isQueue && (
                <div className={styles.payment_detail_button}>
                  <Button onClick={this.onCancel} className={styles.payment_detail_button_cancel}>
                    {formatMessage({ id: 'payment.detail.button.cancel' })}
                  </Button>
                  <Button
                    className={styles.payment_detail_button_submit}
                    onClick={this.onDialogOpen}
                  >
                    {formatMessage({ id: 'payment.detail.button.markPaid' })}
                  </Button>
                </div>
              )}
            </Col>
          </Row>
        </Col>
      </Row>
    ) : (
      <PageLoading size="small" />
    );
  }
}

export default withRouter(PaymentDetail);
