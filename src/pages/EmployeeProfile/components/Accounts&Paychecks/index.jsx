import React, { PureComponent } from 'react';
import { Row, Col, Collapse } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import styles from './index.less';
import PaySlipMonth from './PayslipMonth';

class AccountsPaychecks extends PureComponent {
  render() {
    const { Panel } = Collapse;
    const getyear = new Date();
    const year = getyear.getFullYear();
    return (
      <div className={styles.AccountPaychecks}>
        <Row gutter={24}>
          <Col span={12}>
            <div>
              <div className={styles.backgroundTitle}>
                <p className={styles.TitleDetails}>Bank Details</p>
              </div>
              <div className={styles.flexbox}>
                <div>
                  <p className={styles.titleLeft}>Bank Name</p>
                  <p className={styles.TextLeft}>HDFC Bank, Koramangla</p>
                </div>
                <div>
                  <p className={styles.titleRight}>Account Number</p>
                  <p className={styles.TextRight}>9988774442927</p>
                </div>
              </div>
              <div className={styles.flexbox}>
                <div>
                  <p className={styles.titleLeft}>Account Type</p>
                  <p className={styles.TextLeft}>Savings</p>
                </div>
                <div>
                  <p className={styles.titleRight}>IFSC Code</p>
                  <p className={styles.TextRight}>HDFC000000</p>
                </div>
              </div>
              <div className={styles.flexbox}>
                <div>
                  <p className={styles.titleLeft}>MICR Code</p>
                  <p className={styles.TextLeft}>JKNH- 9836483</p>
                </div>
                <div>
                  <p className={styles.titleRight}>UAN Number</p>
                  <p className={styles.TextRight}>726448834</p>
                </div>
              </div>
            </div>
            <div>
              <div className={styles.backgroundTitle}>
                <p className={styles.TitleDetails}>Tax Details</p>
              </div>
              <div className={styles.flexbox}>
                <div>
                  <p className={styles.titleLeft}>Income Tax Rule</p>
                  <p className={styles.TextLeft}>New Tax Regime</p>
                </div>
                <div>
                  <p className={styles.titleRight}>PAN Number</p>
                  <p className={styles.TextRight}>9988774442927</p>
                </div>
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className={styles.backgroundTitle}>
              <p className={styles.TitleDetails}>Pay Slips</p>
            </div>
            <div>
              <Collapse
                defaultActiveKey={['1']}
                className={styles.CollapseYear}
                expandIconPosition="right"
                expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
              >
                <Panel header={`Year ${year}`} key="1">
                  <PaySlipMonth />
                </Panel>
                <Panel header={`Year ${year - 1}`} key="2">
                  <PaySlipMonth />
                </Panel>
                <Panel header={`Year ${year - 2}`} key="3">
                  <PaySlipMonth />
                </Panel>
              </Collapse>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default AccountsPaychecks;
