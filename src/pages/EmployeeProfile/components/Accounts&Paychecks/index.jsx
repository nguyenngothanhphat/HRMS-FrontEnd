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
    const dataBankDetails = [
      { id: 1, name: 'Bank Name', text: 'HDFC Bank, Koramangla' },
      { id: 2, name: 'Account Number', text: '9988774442927' },
      { id: 3, name: 'Account Type', text: 'Savings' },
      { id: 4, name: 'IFSC Code', text: 'HDFC000000' },
      { id: 5, name: 'MICR Code', text: 'JKNH- 9836483' },
      { id: 6, name: 'UAN Number', text: '8736456' },
    ];
    const dataTaxDetails = [
      { id: 1, name: 'Income Tax Rule', text: 'New Tax Regime' },
      { id: 2, name: 'PAN Number', text: '9988774442927' },
    ];
    return (
      <div className={styles.AccountPaychecks}>
        <Row className={styles.TableBankDetails}>
          <Col span={24} className>
            <div>
              <div className={styles.spaceTitle}>
                <p className={styles.TitleDetails}>Bank Details</p>
              </div>
            </div>
          </Col>
          <Col span={24} className={styles.spaceDetails}>
            {dataBankDetails.map((item) => {
              return (
                <Col key={item.id} span={24} className={styles.flexbox}>
                  <Col span={8}>
                    <p className={styles.Name}>{item.name}</p>
                  </Col>
                  <Col span={8}>
                    <p className={styles.Text}>{item.text}</p>
                  </Col>
                </Col>
              );
            })}
          </Col>
        </Row>

        <Row className={styles.TableTaxDetails}>
          <Col span={24} className>
            <div>
              <div className={styles.spaceTitle}>
                <p className={styles.TitleDetails}>Tax Details</p>
              </div>
            </div>
          </Col>
          <Col span={24} className={styles.spaceDetails}>
            {dataTaxDetails.map((item) => {
              return (
                <Col key={item.id} span={24} className={styles.flexbox}>
                  <Col span={8}>
                    <p className={styles.Name}>{item.name}</p>
                  </Col>
                  <Col span={8}>
                    <p className={styles.Text}>{item.text}</p>
                  </Col>
                </Col>
              );
            })}
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Collapse
              defaultActiveKey={['1']}
              className={styles.CollapseYear}
              expandIconPosition="right"
              expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
            >
              <Panel header={`Pay Slips : Year ${year}`} key="1">
                <PaySlipMonth />
              </Panel>
            </Collapse>
          </Col>
        </Row>

        {/* <Col span={12}>
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
          </Col> */}
      </div>
    );
  }
}

export default AccountsPaychecks;
