import React, { PureComponent } from 'react';
import { Row, Col, Collapse } from 'antd';
import { connect } from 'umi';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import styles from './index.less';
import PaySlipMonth from './PayslipMonth';

@connect(({ employeeProfile: { tempData: { bankData = {}, taxData = {} } = {} } = {} }) => ({
  bankData,
  taxData,
}))
class AccountsPaychecks extends PureComponent {
  handleIconCollapse = (isActive) => {
    return isActive ? <MinusOutlined className={styles.minusIcon} /> : <PlusOutlined />;
  };

  render() {
    const { bankData, taxData } = this.props;
    const { Panel } = Collapse;
    const getyear = new Date();
    const year = getyear.getFullYear();
    let dataBankDetails = [];
    bankData.forEach((element) => {
      dataBankDetails = [
        { id: 1, name: 'Bank Name', text: element ? element.bankName : '' },
        { id: 2, name: 'Account Number', text: element ? element.accountNumber : '' },
        { id: 3, name: 'Account Type', text: element ? element.accountType : '' },
        { id: 4, name: 'IFSC Code', text: element ? element.ifscCode : '' },
        { id: 5, name: 'MICR Code', text: element ? element.micrcCode : '' },
        { id: 6, name: 'UAN Number', text: element ? element.uanNumber : '' },
      ];
    });
    let dataTaxDetails = [];
    taxData.forEach((element) => {
      dataTaxDetails = [
        { id: 1, name: 'Income Tax Rule', text: element ? element.incomeTaxRule : '' },
        { id: 2, name: 'PAN Number', text: element ? element.panNum : '' },
      ];
    });
    return (
      <div className={styles.AccountPaychecks}>
        <Row className={styles.TableBankDetails}>
          <Col span={24}>
            <div>
              <div className={styles.spaceTitle}>
                <p className={styles.TitleDetails}>Bank Details</p>
              </div>
            </div>
          </Col>
          <Col span={24}>
            <div className={styles.spaceDetails}>
              {dataBankDetails.map((item, index) => {
                return (
                  <div key={`bank ${index + 1}`}>
                    <Col key={`bank ${index + 1}`} span={24} className={styles.flexbox}>
                      <Col span={8}>
                        <p className={styles.Name}>{item.name}</p>
                      </Col>
                      <Col span={8}>
                        <p className={styles.Text}>{item.text}</p>
                      </Col>
                    </Col>
                  </div>
                );
              })}
            </div>
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
          <Col span={24}>
            <div className={styles.spaceDetails}>
              {dataTaxDetails.map((item, index) => {
                return (
                  <Col key={`Tax ${index + 1}`} span={24} className={styles.flexbox}>
                    <Col span={8}>
                      <p className={styles.Name}>{item.name}</p>
                    </Col>
                    <Col span={8}>
                      <p className={styles.Text}>{item.text}</p>
                    </Col>
                  </Col>
                );
              })}
            </div>
          </Col>
        </Row>
        <Row className={styles.TableBankDetails}>
          <Col span={24}>
            <Collapse
              defaultActiveKey={['1']}
              className={styles.CollapseYear}
              expandIconPosition="right"
              expandIcon={({ isActive }) => this.handleIconCollapse(isActive)}
            >
              <Panel header={`Pay Slips : Year ${year}`} key="1">
                <PaySlipMonth />
              </Panel>
            </Collapse>
          </Col>
        </Row>
      </div>
    );
  }
}

export default AccountsPaychecks;
