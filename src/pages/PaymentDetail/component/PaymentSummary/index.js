import React, { PureComponent } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { Row, Col, Statistic } from 'antd';
import styles from './index.less';

class PaymentSummary extends PureComponent {
  render() {
    const { payment = {} } = this.props;

    return (
      <div style={{ paddingBottom: '10px' }} className={styles.payment_detail_summary}>
        <div className={styles.title}>{formatMessage({ id: 'payment.detail.summary.title' })}</div>
        <Row gutter={48} className={styles.payment_detail_summary_component}>
          <Col span={24}>
            <Row>
              <Col className={styles.paymentTitle} span={10}>
                <p>{formatMessage({ id: 'payment.paymentNumber' })}</p>
                <p>{formatMessage({ id: 'payment.reimbursable' })}</p>
              </Col>
              <Col className={styles.paymentValue} span={14}>
                <p>{payment.code}</p>
                <p className={styles.payment_detail_summary_amount}>
                  {payment.currency}
                  <Statistic
                    className={styles.payment_summary_totalAmount}
                    value={
                      payment.reimbursable
                        .toFixed(2)
                        .toString()
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1') || 0
                    }
                    precision={2}
                  />
                </p>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

export default PaymentSummary;
